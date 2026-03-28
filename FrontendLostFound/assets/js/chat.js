// assets/js/chat.js
(function () {
    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyDXjBuF3q4Ibihi_6dWdbUzZZejKjAsKTI",
        authDomain: "ujian-project---pemwebmob.firebaseapp.com",
        databaseURL: "https://ujian-project---pemwebmob-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "ujian-project---pemwebmob",
        storageBucket: "ujian-project---pemwebmob.firebasestorage.app",
        messagingSenderId: "542420998647",
        appId: "1:542420998647:web:fc894fd939e1e21b3cb6f2"
    };

    let firebaseSdk = null;
    let firebaseApp = null;

    function getMessageTime(ts) {
        if (!ts) return '';
        const date = new Date(Number(ts));
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    function decodeJwtPayload(token) {
        try {
            const base64Url = token.split('.')[1] || '';
            if (!base64Url) return null;
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(json);
        } catch (_) {
            return null;
        }
    }

    async function loadFirebaseSdk() {
        if (firebaseSdk) return firebaseSdk;

        const [appMod, authMod, dbMod] = await Promise.all([
            import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'),
            import('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'),
            import('https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js')
        ]);

        firebaseSdk = {
            initializeApp: appMod.initializeApp,
            getAuth: authMod.getAuth,
            signInWithCustomToken: authMod.signInWithCustomToken,
            updateProfile: authMod.updateProfile,
            getDatabase: dbMod.getDatabase,
            ref: dbMod.ref,
            onValue: dbMod.onValue,
            push: dbMod.push,
            set: dbMod.set,
            get: dbMod.get,
        };

        return firebaseSdk;
    }

    async function ensureFirebaseApp() {
        const sdk = await loadFirebaseSdk();
        if (!firebaseApp) {
            firebaseApp = sdk.initializeApp(FIREBASE_CONFIG);
        }
        return sdk;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const chatWidget = document.getElementById('krlChatWidget');
        const toggleBtn = document.getElementById('chatToggleBtn');
        const minimizeBtn = document.getElementById('chatMinimizeBtn');
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        const chatMessages = document.getElementById('chatMessages');
        const chatStatus = document.getElementById('chatStatus');
        const chatBadge = document.getElementById('chatBadge');
        const chatRoomControls = document.getElementById('chatRoomControls');
        const chatRoomSelect = document.getElementById('chatRoomSelect');
        const chatRefreshRoomsBtn = document.getElementById('chatRefreshRoomsBtn');
        const officerCreateWrap = document.getElementById('chatOfficerCreateWrap');
        const laporanSelect = document.getElementById('chatLaporanSelect');
        const createRoomBtn = document.getElementById('chatCreateRoomBtn');
        const endRoomBtn = document.getElementById('chatEndRoomBtn');

        if (!chatWidget || !toggleBtn || !minimizeBtn || !chatInput || !chatSendBtn || !chatMessages || !chatStatus) {
            return;
        }

        const isOfficer = chatWidget.getAttribute('data-officer') === 'true';
        const loginUrl = chatWidget.getAttribute('data-login-url') || (window.APP_CONFIG.FRONTEND_BASE_URL + '/login.php');

        let initialized = false;
        let connecting = false;
        let isConnected = false;
        let currentRoomId = '';
        let currentRoomRef = null;
        let unsubscribeMessages = null;
        let firebaseDb = null;
        let firebaseIdentity = {
            uid: '',
            name: '',
            username: ''
        };
        let rooms = [];
        let unreadCount = 0;
        const roomUnreadUnsubscribers = new Map();
        const roomMessagesCache = Object.create(null);
        const roomLastReadCache = Object.create(null);
        const roomUnreadCache = Object.create(null);
        const roomReadWriteCache = Object.create(null);

        function updateBadge(value) {
            unreadCount = Math.max(0, Number(value) || 0);
            if (chatBadge) {
                chatBadge.textContent = String(unreadCount > 99 ? '99+' : unreadCount);
            }
        }

        function isWidgetMaximized() {
            return chatWidget.classList.contains('maximized');
        }

        function isCurrentRoomVisible() {
            return isWidgetMaximized() && document.visibilityState === 'visible';
        }

        function countUnreadForRoom(roomId) {
            const rows = roomMessagesCache[roomId] ? Object.entries(roomMessagesCache[roomId]) : [];
            const lastReadTs = Number(roomLastReadCache[roomId]) || 0;
            const myUid = String(firebaseIdentity.uid || '');

            return rows.reduce((total, [key, msg]) => {
                const ts = Number(msg?.timestamp) || 0;
                const senderId = String(msg?.sender_id || '');
                if (ts > lastReadTs && senderId !== myUid) {
                    return total + 1;
                }
                return total;
            }, 0);
        }

        function refreshTotalUnread() {
            const availableRoomIds = new Set(rooms.map((room) => String(room.firebase_room_id || '')));
            const total = Object.entries(roomUnreadCache).reduce((sum, [roomId, count]) => {
                if (!availableRoomIds.has(roomId)) return sum;
                return sum + Math.max(0, Number(count) || 0);
            }, 0);
            updateBadge(total);
        }

        function refreshRoomUnread(roomId) {
            if (!roomId) return;

            if (roomId === currentRoomId && isCurrentRoomVisible()) {
                roomUnreadCache[roomId] = 0;
                refreshTotalUnread();
                return;
            }

            roomUnreadCache[roomId] = countUnreadForRoom(roomId);
            refreshTotalUnread();
        }

        function teardownUnreadSubscriptions() {
            roomUnreadUnsubscribers.forEach((unsubscribe) => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            });

            roomUnreadUnsubscribers.clear();

            Object.keys(roomMessagesCache).forEach((roomId) => {
                delete roomMessagesCache[roomId];
                delete roomLastReadCache[roomId];
                delete roomUnreadCache[roomId];
                delete roomReadWriteCache[roomId];
            });
        }

        async function markRoomAsRead(roomId) {
            if (!roomId || !firebaseDb || !isConnected || !firebaseIdentity.uid) return;

            let maxTs = Date.now();
            const msgs = roomMessagesCache[roomId];
            if (msgs) {
                Object.entries(msgs).forEach(([k, m]) => {
                    const ts = Number(m.timestamp) || 0;
                    if (ts > maxTs) maxTs = ts;
                });
            }

            const now = Date.now();
            const lastWrittenAt = Number(roomReadWriteCache[roomId]) || 0;
            const lastReadTs = Number(roomLastReadCache[roomId]) || 0;

            const updateTs = maxTs + 1;

            if (now - lastWrittenAt < 1200 || updateTs <= lastReadTs) {
                return;
            }

            roomReadWriteCache[roomId] = now;
            roomLastReadCache[roomId] = updateTs;
            roomUnreadCache[roomId] = 0;
            refreshTotalUnread();

            try {
                const sdk = await ensureFirebaseApp();
                const readRef = sdk.ref(firebaseDb, 'room_meta/' + roomId + '/participants/' + firebaseIdentity.uid + '/last_read_ts');
                await sdk.set(readRef, updateTs);
            } catch (_) {
                roomReadWriteCache[roomId] = 0;
            }
        }

        async function initLastReadTsFromFirebase(roomId) {
            if (!roomId || !firebaseDb || !firebaseIdentity.uid) return;

            try {
                const sdk = await ensureFirebaseApp();
                const readRef = sdk.ref(firebaseDb, 'room_meta/' + roomId + '/participants/' + firebaseIdentity.uid + '/last_read_ts');
                const snapshot = await sdk.get(readRef);
                const lastReadValue = Number(snapshot.val()) || 0;
                roomLastReadCache[roomId] = lastReadValue;
            } catch (err) {
                roomLastReadCache[roomId] = 0;
            }
        }

        async function subscribeUnreadForRooms() {
            teardownUnreadSubscriptions();

            if (!firebaseDb || !rooms.length) {
                updateBadge(0);
                return;
            }

            const sdk = await ensureFirebaseApp();

            await Promise.all(rooms.map(room => initLastReadTsFromFirebase(String(room.firebase_room_id || ''))));

            rooms.forEach((room) => {
                const roomId = String(room.firebase_room_id || '');
                if (!roomId) return;

                roomMessagesCache[roomId] = null;
                roomUnreadCache[roomId] = 0;

                const chatRef = sdk.ref(firebaseDb, 'chats/' + roomId);
                const readRef = sdk.ref(firebaseDb, 'room_meta/' + roomId + '/participants/' + firebaseIdentity.uid + '/last_read_ts');

                const stopMessages = sdk.onValue(chatRef, (snapshot) => {
                    roomMessagesCache[roomId] = snapshot.val();
                    refreshRoomUnread(roomId);

                    if (roomId === currentRoomId && isCurrentRoomVisible()) {
                        void markRoomAsRead(roomId);
                    }
                });

                // Listener untuk update realtime last_read_ts (ketika user lain di room yang sama membaca)
                const stopRead = sdk.onValue(readRef, (snapshot) => {
                    const newLastReadValue = Number(snapshot.val()) || 0;
                    if (newLastReadValue > Number(roomLastReadCache[roomId] || 0)) {
                        roomLastReadCache[roomId] = newLastReadValue;
                        refreshRoomUnread(roomId);
                    }
                });

                roomUnreadUnsubscribers.set(roomId, () => {
                    if (typeof stopMessages === 'function') stopMessages();
                    if (typeof stopRead === 'function') stopRead();
                });
            });
        }

        function setStatus(text) {
            chatStatus.textContent = text;
        }

        function roomStatusLabel(status) {
            return status === 'selesai' ? 'Selesai' : 'Aktif';
        }

        function formatRoomDate(value) {
            if (!value) return '';
            const date = new Date(String(value).replace(' ', 'T'));
            if (Number.isNaN(date.getTime())) return '';
            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }

        function getRoomLabel(room, index) {
            const status = roomStatusLabel(room.status);
            const when = formatRoomDate(room.created_at);
            const reportName = String(room.laporan_nama || '').trim() || 'Barang tidak diketahui';
            const title = isOfficer
                ? ('Pelapor: ' + (room.pelapor_name || ('Pelapor #' + room.pelapor_id)) + ' - Barang: ' + reportName + ' - ' + status)
                : ('Petugas: ' + (room.petugas_name || ('Petugas #' + room.petugas_id)) + ' - Barang: ' + reportName + ' - ' + status);
            return when ? (title + ' (' + when + ')') : title;
        }

        function setInputEnabled(enabled) {
            chatInput.disabled = !enabled;
            chatSendBtn.disabled = !enabled;
            if (!enabled) chatInput.value = '';
        }

        function clearMessages(stateText) {
            chatMessages.innerHTML = '';
            const box = document.createElement('div');
            box.id = 'chatMessagesState';
            box.className = 'helper-box';
            box.textContent = stateText;
            chatMessages.appendChild(box);
        }

        function appendMessage(msg, isMine, isUnread) {
            const wrapper = document.createElement('div');
            const messageClass = 'message ' + (isMine ? 'msg-sent' : 'msg-received') + (isUnread && !isMine ? ' msg-unread' : ' msg-read');
            wrapper.className = messageClass;

            const bubble = document.createElement('div');
            bubble.className = 'msg-bubble';

            if (!isMine) {
                const sender = document.createElement('div');
                sender.style.fontWeight = '600';
                sender.style.fontSize = '12px';
                sender.style.marginBottom = '4px';
                const name = msg.sender_name || 'User';
                const username = msg.sender_username ? ' (' + msg.sender_username + ')' : '';
                sender.textContent = name + username;
                bubble.appendChild(sender);

                if (isUnread) {
                    const unreadBadge = document.createElement('div');
                    unreadBadge.className = 'msg-unread-badge';
                    unreadBadge.textContent = '●';
                    unreadBadge.title = 'Belum dibaca';
                    bubble.appendChild(unreadBadge);
                }
            }

            const textNode = document.createElement('div');
            textNode.textContent = msg.text || '';
            bubble.appendChild(textNode);

            const timeDiv = document.createElement('div');
            timeDiv.className = 'msg-time';
            timeDiv.textContent = getMessageTime(msg.timestamp);

            wrapper.appendChild(bubble);
            wrapper.appendChild(timeDiv);
            chatMessages.appendChild(wrapper);
        }

        function renderMessages(snapshotValue) {
            const rows = snapshotValue ? Object.entries(snapshotValue) : [];
            if (!rows.length) {
                clearMessages('Belum ada pesan. Mulai percakapan sekarang.');
                if (currentRoomId && isCurrentRoomVisible()) {
                    void markRoomAsRead(currentRoomId);
                }
                return;
            }

            chatMessages.innerHTML = '';

            const lastReadTs = Number(roomLastReadCache[currentRoomId]) || 0;
            const myUid = String(firebaseIdentity.uid || '');

            rows
                .map(([key, value]) => ({ key, ...value }))
                .sort((a, b) => {
                    const ta = Number(a.timestamp) || 0;
                    const tb = Number(b.timestamp) || 0;
                    if (ta === tb) return String(a.key).localeCompare(String(b.key));
                    return ta - tb;
                })
                .forEach((msg) => {
                    const isMine = String(msg.sender_id) === String(myUid);
                    const msgTs = Number(msg.timestamp) || 0;
                    const isUnread = !isMine && msgTs > lastReadTs;
                    appendMessage(msg, isMine, isUnread);
                    
                    // Menonaktifkan input chat jika terdeteksi pesan sistem penutupan room
                    if (msg.sender_id === 'system' && String(msg.text).includes('Room ditutup')) {
                        setInputEnabled(false);
                        const r = rooms.find(item => item.firebase_room_id === currentRoomId);
                        if (r) r.status = 'selesai';
                        if (endRoomBtn) endRoomBtn.classList.add('hidden');
                    }
                });

            chatMessages.scrollTop = chatMessages.scrollHeight;

            if (currentRoomId && isCurrentRoomVisible()) {
                void markRoomAsRead(currentRoomId);
            }
        }

        function teardownRoomSubscription() {
            if (typeof unsubscribeMessages === 'function') {
                unsubscribeMessages();
            }
            unsubscribeMessages = null;
            currentRoomRef = null;
        }

        function renderRoomOptions(preferredRoomId) {
            if (!chatRoomSelect || !chatRoomControls) return;

            chatRoomSelect.innerHTML = '';
            if (!rooms.length) {
                chatRoomControls.classList.remove('hidden');
                const emptyOpt = document.createElement('option');
                emptyOpt.value = '';
                emptyOpt.textContent = isOfficer ? 'Belum ada room. Buat room dari laporan.' : 'Belum ada room aktif.';
                chatRoomSelect.appendChild(emptyOpt);
                chatRoomSelect.disabled = true;
                setInputEnabled(false);
                return;
            }

            rooms.forEach((room, index) => {
                const opt = document.createElement('option');
                opt.value = room.firebase_room_id;
                opt.textContent = getRoomLabel(room, index);
                opt.title = room.firebase_room_id;
                chatRoomSelect.appendChild(opt);
            });

            chatRoomControls.classList.remove('hidden');
            chatRoomSelect.disabled = false;

            const target = preferredRoomId || currentRoomId || rooms.find((r) => r.status === 'aktif')?.firebase_room_id || rooms[0].firebase_room_id;
            chatRoomSelect.value = target;
            void joinRoom(target);
        }

        async function joinRoom(roomId) {
            if (!isConnected || !firebaseDb || !roomId) {
                setInputEnabled(false);
                currentRoomId = '';
                if (endRoomBtn) endRoomBtn.classList.add('hidden');
                return;
            }

            const selected = rooms.find((item) => item.firebase_room_id === roomId);
            if (!selected) {
                setStatus('Room tidak ditemukan. Silakan refresh daftar room.');
                setInputEnabled(false);
                if (endRoomBtn) endRoomBtn.classList.add('hidden');
                return;
            }

            teardownRoomSubscription();
            currentRoomId = roomId;

            const sdk = await ensureFirebaseApp();
            currentRoomRef = sdk.ref(firebaseDb, 'chats/' + roomId);

            const selectedIndex = rooms.findIndex((item) => item.firebase_room_id === roomId);
            const prettyLabel = selectedIndex >= 0 ? getRoomLabel(selected, selectedIndex) : 'percakapan terpilih';
            setInputEnabled(selected.status === 'aktif');
            setStatus('Masuk ke room: ' + prettyLabel + '.');

            // Show/hide end room button based on officer role and room status
            if (isOfficer && endRoomBtn) {
                if (selected.status === 'aktif') {
                    endRoomBtn.classList.remove('hidden');
                    endRoomBtn.disabled = false;
                } else {
                    endRoomBtn.classList.add('hidden');
                }
            }

            unsubscribeMessages = sdk.onValue(currentRoomRef, (snapshot) => {
                renderMessages(snapshot.val());
            }, () => {
                clearMessages('Gagal membaca pesan realtime. Coba refresh room.');
            });

            if (isCurrentRoomVisible()) {
                void markRoomAsRead(roomId);
            }
        }

        async function loadRooms(preferredRoomId) {
            if (!isConnected) return;

            try {
                const response = await FinderApp.apiFetch('/api/chat-rooms');
                rooms = Array.isArray(response?.data) ? response.data : [];
                await subscribeUnreadForRooms();
                renderRoomOptions(preferredRoomId);

                if (!rooms.length) {
                    setStatus(isOfficer ? 'Belum ada room. Buat room baru dari laporan.' : 'Belum ada room chat untuk akun Anda.');
                    clearMessages(isOfficer ? 'Buat room dulu untuk mulai percakapan.' : 'Petugas belum membuat room untuk laporan Anda.');
                }
            } catch (error) {
                setStatus(FinderApp.getApiErrorMessage(error, 'Gagal memuat daftar room.'));
                clearMessages('Daftar room tidak dapat dimuat.');
            }
        }

        async function loadOfficerReports() {
            if (!isOfficer || !laporanSelect) return;

            try {
                const response = await FinderApp.apiFetch('/api/lost-reports?status=menunggu');
                const reports = response?.data?.lost_reports || [];

                laporanSelect.innerHTML = '';
                if (!reports.length) {
                    const opt = document.createElement('option');
                    opt.value = '';
                    opt.textContent = 'Tidak ada laporan status menunggu';
                    laporanSelect.appendChild(opt);
                    if (createRoomBtn) createRoomBtn.disabled = true;
                    return;
                }

                reports.forEach((item) => {
                    const opt = document.createElement('option');
                    opt.value = String(item.id);
                    opt.textContent = '#' + item.id + ' - ' + (item.nama_barang || 'Laporan') + ' (' + (item.pelapor_name || '-') + ')';
                    laporanSelect.appendChild(opt);
                });

                if (createRoomBtn) createRoomBtn.disabled = false;
            } catch (error) {
                laporanSelect.innerHTML = '';
                const opt = document.createElement('option');
                opt.value = '';
                opt.textContent = 'Gagal memuat laporan';
                laporanSelect.appendChild(opt);
                if (createRoomBtn) createRoomBtn.disabled = true;
                setStatus(FinderApp.getApiErrorMessage(error, 'Gagal memuat daftar laporan.'));
            }
        }

        async function connectRealtime() {
            if (connecting || initialized) return;

            const currentUser = FinderApp.getStoredUser();
            const token = FinderApp.getStoredToken();
            if (!currentUser || !token) return;

            connecting = true;
            setStatus('Menghubungkan chat realtime...');

            try {
                const firebaseTokenRes = await FinderApp.apiFetch('/api/chat/firebase-token');
                const firebaseCustomToken = firebaseTokenRes?.data?.firebase_token;
                if (!firebaseCustomToken) {
                    throw new Error('Token Firebase tidak tersedia.');
                }

                const claimsPayload = decodeJwtPayload(firebaseCustomToken);
                const claims = claimsPayload?.claims || {};

                const sdk = await ensureFirebaseApp();
                const auth = sdk.getAuth(firebaseApp);
                firebaseDb = sdk.getDatabase(firebaseApp);

                const userCredential = await sdk.signInWithCustomToken(auth, firebaseCustomToken);
                firebaseIdentity.uid = String(userCredential.user.uid || currentUser.user_id || '');
                firebaseIdentity.name = String(claims.name || currentUser.name || 'User');
                firebaseIdentity.username = String(claims.username || currentUser.email?.split('@')[0] || 'user');

                try {
                    await sdk.updateProfile(userCredential.user, { displayName: firebaseIdentity.name });
                } catch (_) {}

                isConnected = true;
                initialized = true;
                setStatus('Terhubung sebagai ' + firebaseIdentity.name + '.');

                if (chatRoomControls) chatRoomControls.classList.remove('hidden');
                if (isOfficer && officerCreateWrap) officerCreateWrap.classList.remove('hidden');

                await Promise.all([
                    loadRooms(),
                    isOfficer ? loadOfficerReports() : Promise.resolve()
                ]);
            } catch (error) {
                const rawMessage = String(error?.message || '');
                if (rawMessage.includes('auth/invalid-custom-token')) {
                    setStatus('Token Firebase tidak valid. Cek service account backend dan sinkronisasi project Firebase.');
                } else {
                    setStatus(FinderApp.getApiErrorMessage(error, 'Koneksi chat gagal.'));
                }
                clearMessages('Tidak dapat menghubungkan chat saat ini.');
            } finally {
                connecting = false;
            }
        }

        function redirectGuestToLogin() {
            FinderApp.showToast('Silakan login terlebih dahulu untuk menggunakan chat.', 'info');
            setTimeout(() => {
                window.location.href = loginUrl;
            }, 250);
        }

        async function onOpenChat() {
            const user = FinderApp.getStoredUser();
            const token = FinderApp.getStoredToken();

            if (!user || !token) {
                redirectGuestToLogin();
                return;
            }

            chatWidget.classList.remove('minimized');
            chatWidget.classList.add('maximized');

            await connectRealtime();

            if (currentRoomId && !chatInput.disabled) {
                chatInput.focus();
            }

            if (currentRoomId) {
                await markRoomAsRead(currentRoomId);
            }
        }

        async function connectChatOnly() {
            const user = FinderApp.getStoredUser();
            const token = FinderApp.getStoredToken();

            if (!user || !token) {
                return;
            }

            await connectRealtime();
        }

        async function sendMessage() {
            const text = chatInput.value.trim();
            if (!text || !currentRoomRef || !isConnected) return;

            const room = rooms.find((item) => item.firebase_room_id === currentRoomId);
            if (!room || room.status !== 'aktif') {
                FinderApp.showToast('Room ini sudah ditutup.', 'error');
                setInputEnabled(false);
                return;
            }

            try {
                const sdk = await ensureFirebaseApp();
                await sdk.push(currentRoomRef, {
                    sender_id: firebaseIdentity.uid,
                    sender_name: firebaseIdentity.name,
                    sender_username: firebaseIdentity.username,
                    text,
                    timestamp: Date.now()
                });
                chatInput.value = '';
            } catch (error) {
                FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal mengirim pesan.'), 'error');
            }
        }

        toggleBtn.addEventListener('click', () => {
            void onOpenChat();
        });

        minimizeBtn.addEventListener('click', () => {
            chatWidget.classList.remove('maximized');
            chatWidget.classList.add('minimized');
        });

        chatSendBtn.addEventListener('click', () => {
            void sendMessage();
        });

        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                void sendMessage();
            }
        });

        if (chatRefreshRoomsBtn) {
            chatRefreshRoomsBtn.addEventListener('click', () => {
                void loadRooms();
            });
        }

        if (chatRoomSelect) {
            chatRoomSelect.addEventListener('change', () => {
                void joinRoom(chatRoomSelect.value);
            });
        }

        if (createRoomBtn && laporanSelect) {
            createRoomBtn.addEventListener('click', async () => {
                const laporanId = Number(laporanSelect.value);
                if (!laporanId) {
                    FinderApp.showToast('Pilih laporan yang valid untuk membuat room.', 'error');
                    return;
                }

                createRoomBtn.disabled = true;
                createRoomBtn.textContent = 'Membuat...';

                try {
                    const response = await FinderApp.apiFetch('/api/chat-rooms', {
                        method: 'POST',
                        body: { laporan_id: laporanId }
                    });

                    const createdRoom = response?.data;
                    const preferredRoom = createdRoom?.firebase_room_id || '';
                    FinderApp.showToast('Room chat siap digunakan.', 'success');

                    await loadRooms(preferredRoom);
                    await loadOfficerReports();
                } catch (error) {
                    FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal membuat room chat.'), 'error');
                } finally {
                    createRoomBtn.disabled = false;
                    createRoomBtn.textContent = 'Buat Room';
                }
            });
        }

        if (endRoomBtn) {
            endRoomBtn.addEventListener('click', async () => {
                const room = rooms.find((item) => item.firebase_room_id === currentRoomId);
                if (!room || !room.id) {
                    FinderApp.showToast('Gagal memproses. Room tidak valid.', 'error');
                    return;
                }

                if (!confirm('Apakah Anda yakin ingin mengakhiri percakapan ini?')) {
                    return;
                }

                endRoomBtn.disabled = true;
                const originalText = endRoomBtn.innerHTML;
                endRoomBtn.innerHTML = 'Memproses...';

                try {
                    // Kirim log ke firebase sebelum status room diubah menjadi selesai oleh backend
                    // untuk menghindari Firebase Rules permission_denied
                    if (currentRoomRef && isConnected) {
                        try {
                            const sdk = await ensureFirebaseApp();
                            await sdk.push(currentRoomRef, {
                                sender_id: 'system',
                                sender_name: 'Sistem',
                                sender_username: 'Sistem',
                                text: 'Percakapan ini telah diakhiri oleh petugas. Room ditutup.',
                                timestamp: Date.now()
                            });
                        } catch (e) {
                            console.error('Info: Gagal log penutupan ke firebase', e);
                        }
                    }

                    await FinderApp.apiFetch('/api/chat-rooms/' + room.id + '/end', {
                        method: 'PUT'
                    });
                    FinderApp.showToast('Percakapan telah diakhiri.', 'success');

                    await loadRooms(currentRoomId);
                } catch (error) {
                    FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal mengakhiri room.'), 'error');
                } finally {
                    endRoomBtn.disabled = false;
                    endRoomBtn.innerHTML = originalText;
                }
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && isConnected && chatWidget.classList.contains('maximized')) {
                void loadRooms(currentRoomId);
                if (currentRoomId) {
                    void markRoomAsRead(currentRoomId);
                }
            }
        });

        window.addEventListener('beforeunload', () => {
            teardownRoomSubscription();
            teardownUnreadSubscriptions();
        });

        updateBadge(0);
        setInputEnabled(false);
        clearMessages('Klik ikon chat untuk mulai. Jika belum login, Anda akan diarahkan ke halaman login.');

        // Auto-connect chat saat page load (tanpa membuka modal)
        setTimeout(() => {
            void connectChatOnly();
        }, 500);
    });
})();
