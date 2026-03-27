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

        function updateBadge(value) {
            unreadCount = Math.max(0, Number(value) || 0);
            if (chatBadge) {
                chatBadge.textContent = String(unreadCount > 99 ? '99+' : unreadCount);
            }
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

        function appendMessage(msg, isMine) {
            const wrapper = document.createElement('div');
            wrapper.className = 'message ' + (isMine ? 'msg-sent' : 'msg-received');

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
                return;
            }

            chatMessages.innerHTML = '';

            rows
                .map(([key, value]) => ({ key, ...value }))
                .sort((a, b) => {
                    const ta = Number(a.timestamp) || 0;
                    const tb = Number(b.timestamp) || 0;
                    if (ta === tb) return String(a.key).localeCompare(String(b.key));
                    return ta - tb;
                })
                .forEach((msg) => {
                    const isMine = String(msg.sender_id) === String(firebaseIdentity.uid);
                    appendMessage(msg, isMine);
                });

            chatMessages.scrollTop = chatMessages.scrollHeight;
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
                return;
            }

            const selected = rooms.find((item) => item.firebase_room_id === roomId);
            if (!selected) {
                setStatus('Room tidak ditemukan. Silakan refresh daftar room.');
                setInputEnabled(false);
                return;
            }

            teardownRoomSubscription();
            currentRoomId = roomId;

            const sdk = await ensureFirebaseApp();
            currentRoomRef = sdk.ref(firebaseDb, 'chats/' + roomId);

            const selectedIndex = rooms.findIndex((item) => item.firebase_room_id === roomId);
            const prettyLabel = selectedIndex >= 0 ? getRoomLabel(selected, selectedIndex) : 'percakapan terpilih';
            setStatus('Terhubung ke ' + prettyLabel + '.');
            setInputEnabled(selected.status === 'aktif');

            unsubscribeMessages = sdk.onValue(currentRoomRef, (snapshot) => {
                renderMessages(snapshot.val());
            }, () => {
                clearMessages('Gagal membaca pesan realtime. Coba refresh room.');
            });
        }

        async function loadRooms(preferredRoomId) {
            if (!isConnected) return;

            setStatus('Memuat daftar room...');
            try {
                const response = await FinderApp.apiFetch('/api/chat-rooms');
                rooms = Array.isArray(response?.data) ? response.data : [];
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

            updateBadge(0);
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

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && isConnected && chatWidget.classList.contains('maximized')) {
                void loadRooms(currentRoomId);
            }
        });

        window.addEventListener('beforeunload', () => {
            teardownRoomSubscription();
        });

        updateBadge(0);
        setInputEnabled(false);
        clearMessages('Klik ikon chat untuk mulai. Jika belum login, Anda akan diarahkan ke halaman login.');
    });
})();
