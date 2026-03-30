(function () {
    const STORAGE_TOKEN = 'finder_auth_token';
    const STORAGE_USER = 'finder_auth_user';
    const STORAGE_REMEMBER = 'finder_auth_remember';

    function getStoredToken() {
        return localStorage.getItem(STORAGE_TOKEN) || sessionStorage.getItem(STORAGE_TOKEN);
    }

    function getStoredUser() {
        const raw = localStorage.getItem(STORAGE_USER) || sessionStorage.getItem(STORAGE_USER);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch (_) { return null; }
    }

    function getRememberPreference() {
        return !!localStorage.getItem(STORAGE_REMEMBER);
    }

    function persistAuth(token, user, remember = true) {
        clearAuth();
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(STORAGE_TOKEN, token);
        storage.setItem(STORAGE_USER, JSON.stringify(user));
        if (remember) localStorage.setItem(STORAGE_REMEMBER, '1');
    }

    function clearAuth() {
        [localStorage, sessionStorage].forEach((storage) => {
            storage.removeItem(STORAGE_TOKEN);
            storage.removeItem(STORAGE_USER);
        });
        localStorage.removeItem(STORAGE_REMEMBER);
    }

    function getHomePathByRole(role) {
        return role === 'petugas' ? '/officer-home.php' : '/index.php';
    }

    function getProfilePathByRole(role) {
        return role === 'petugas' ? '/officer-profile.php' : '/profile.php';
    }

    function redirectToLogin(message) {
        if (message) sessionStorage.setItem('finder_flash_message', message);
        window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + '/login.php';
    }

    function redirectToRoleHome(role, message) {
        if (message) sessionStorage.setItem('finder_flash_message', message);
        window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + getHomePathByRole(role);
    }

    async function apiFetch(endpoint, options = {}) {
        const token = getStoredToken();
        const headers = new Headers(options.headers || {});
        const isFormData = options.body instanceof FormData;

        if (!isFormData && !headers.has('Content-Type') && options.body && typeof options.body !== 'string') {
            headers.set('Content-Type', 'application/json');
        }

        if (token) headers.set('Authorization', 'Bearer ' + token);

        const response = await fetch(window.APP_CONFIG.API_BASE_URL + endpoint, {
            ...options,
            headers,
            body: isFormData || typeof options.body === 'string'
                ? options.body
                : (options.body ? JSON.stringify(options.body) : undefined),
        });

        let payload = null;
        try {
            payload = await response.json();
        } catch (_) {
            payload = null;
        }

        if (response.status === 401) {
            const message = payload?.message || 'Unauthorized';
            const lowerMessage = message.toLowerCase();
            const tokenProblem = lowerMessage.includes('token') || lowerMessage.includes('kadaluarsa') || lowerMessage.includes('tidak terautentikasi');

            if (tokenProblem) {
                clearAuth();
                redirectToLogin('Sesi login berakhir. Silakan login kembali.');
            }

            const error = new Error(message);
            error.status = response.status;
            error.payload = payload;
            throw error;
        }

        if (!response.ok) {
            const error = new Error(payload?.message || 'Terjadi kesalahan pada server.');
            error.status = response.status;
            error.payload = payload;
            throw error;
        }

        return payload;
    }

    function showToast(message, type = 'info', timeout = 3500) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => toast.remove(), timeout);
    }

    function showAlert(title, message, type = 'info') {
        let modal = document.getElementById('finderAlertModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'finderAlertModal';
            modal.className = 'finder-modal';
            modal.hidden = true;
            modal.innerHTML = `
                <div class="finder-modal-backdrop" data-close-modal></div>
                <div class="finder-modal-dialog" style="max-width: 380px; text-align: center; padding: 40px 24px;">
                    <div id="finderAlertIcon" style="font-size: 4rem; margin-bottom: 16px; line-height: 1;"></div>
                    <h3 id="finderAlertTitle" style="margin-bottom: 10px; font-size: 22px;"></h3>
                    <p id="finderAlertMessage" style="margin-bottom: 28px; color: rgba(19,19,22,0.72); line-height: 1.6; font-size: 15px; padding: 0 10px;"></p>
                    <button type="button" class="btn btn-primary btn-block" data-close-modal id="finderAlertBtn">Oke, Mengerti</button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        const iconEl = document.getElementById('finderAlertIcon');
        const titleEl = document.getElementById('finderAlertTitle');
        const msgEl = document.getElementById('finderAlertMessage');

        titleEl.textContent = title;
        msgEl.textContent = message;

        if (type === 'success') {
            iconEl.innerHTML = '<i class="bi bi-check-circle-fill" style="color: #1b7a44;"></i>';
        } else if (type === 'error') {
            iconEl.innerHTML = '<i class="bi bi-x-circle-fill" style="color: #a22626;"></i>';
        } else {
            iconEl.innerHTML = '<i class="bi bi-info-circle-fill" style="color: #244cff;"></i>';
        }

        openModal(modal);
    }

    function consumeFlashMessage() {
        const message = sessionStorage.getItem('finder_flash_message');
        if (message) {
            showToast(message, 'info');
            sessionStorage.removeItem('finder_flash_message');
        }
    }

    function getApiErrorMessage(error, fallback = 'Terjadi kesalahan.') {
        if (error?.payload?.data) {
            const firstError = Object.values(error.payload.data)[0];
            if (firstError) return firstError;
        }
        return error?.message || fallback;
    }

    function formatDateTime(value) {
        if (!value) return '-';
        const normalized = value.replace(' ', 'T');
        const date = new Date(normalized);
        if (Number.isNaN(date.getTime())) return value;
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(date);
    }

    function splitDateTime(value) {
        if (!value || !value.includes(' ')) return { date: '', time: '' };
        const [date, time] = value.split(' ');
        return { date, time: time?.slice(0, 5) || '' };
    }

    function combineDateTime(date, time) {
        if (!date || !time) return '';
        return `${date} ${time}:00`;
    }

    function statusBadgeClass(status) {
        const map = {
            tersimpan: 'badge-gray',
            menunggu: 'badge-gray',
            dicocokkan: 'badge-blue',
            diverifikasi: 'badge-blue',
            diserahkan: 'badge-gold',
            selesai: 'badge-green',
            ditutup: 'badge-red',
            dibatalkan: 'badge-red',
            pending: 'badge-gray',
        };
        return map[status] || 'badge-gray';
    }

    function statusBadge(status) {
        const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '-';
        return `<span class="badge ${statusBadgeClass(status)}">${label}</span>`;
    }

    function formatStatus(status) {
        if (!status) return '-';
        const formatted = status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return formatted;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text ?? '';
        return div.innerHTML;
    }

    function syncBodyScrollLock() {
        const hasOpenModal = document.querySelector('.finder-modal:not([hidden])');
        if (hasOpenModal) {
            document.body.classList.add('finder-modal-open');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.classList.remove('finder-modal-open');
            document.body.style.overflow = '';
        }
    }
    
    function openModal(id) {
        const modal = typeof id === 'string' ? document.getElementById(id) : id;
        if (!modal) return;
    
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        syncBodyScrollLock();
    }
    
    function closeModal(modal) {
        if (!modal) return;
    
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        syncBodyScrollLock();
    }
    
    function closeAllModals() {
        document.querySelectorAll('.finder-modal:not([hidden])').forEach((modal) => {
            closeModal(modal);
        });
    }
    
    function bindModalEvents() {
        document.addEventListener('click', (event) => {
            const closeBtn = event.target.closest('[data-close-modal]');
            if (closeBtn) {
                const modal = closeBtn.closest('.finder-modal');
                closeModal(modal);
                return;
            }
        });
    
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAllModals();
            }
        });
    }

    function togglePasswordVisibility(trigger) {
        const targetId = trigger.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        input.type = input.type === 'password' ? 'text' : 'password';
        trigger.textContent = input.type === 'password' ? '👁' : '🙈';
    }

    function bindPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach((btn) => {
            btn.addEventListener('click', () => togglePasswordVisibility(btn));
        });
    }

    function bindMobileNav() {
        const toggle = document.getElementById('mobileNavToggle');
        const nav = document.getElementById('mainNav');
        if (!toggle || !nav) return;
    
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            nav.classList.toggle('is-open');
    
            if (!nav.classList.contains('is-open')) {
                document.querySelectorAll('.nav-group').forEach((group) => group.classList.remove('is-open'));
            }
        });
    
        document.addEventListener('click', (event) => {
            const clickedInsideNav = nav.contains(event.target);
            const clickedToggle = toggle.contains(event.target);
    
            if (!clickedInsideNav && !clickedToggle && window.innerWidth <= 820) {
                nav.classList.remove('is-open');
                document.querySelectorAll('.nav-group').forEach((group) => group.classList.remove('is-open'));
            }
        });
    }

    function bindNavGroups() {
        document.querySelectorAll('.nav-group-toggle').forEach((btn) => {
            btn.addEventListener('click', () => {
                if (window.innerWidth > 820) return;
                btn.parentElement.classList.toggle('is-open');
            });
        });
    }

    function bindOfficerDropdowns() {
        const groups = document.querySelectorAll('.nav-group');
        if (!groups.length) return;
    
        function closeAll(except = null) {
            groups.forEach((group) => {
                if (group !== except) {
                    group.classList.remove('is-open');
                    group.classList.remove('is-pinned');
                }
            });
        }
    
        groups.forEach((group) => {
            const toggle = group.querySelector('.nav-group-toggle');
            const dropdown = group.querySelector('.nav-dropdown');
            if (!toggle || !dropdown) return;
    
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
    
                const isPinned = group.classList.contains('is-pinned');
                closeAll();
    
                if (!isPinned) {
                    group.classList.add('is-open');
                    group.classList.add('is-pinned');
                }
            });
    
            dropdown.addEventListener('click', (event) => {
                event.stopPropagation();
            });
    
            group.addEventListener('mouseenter', () => {
                if (window.innerWidth > 820) {
                    closeAll(group);
                    group.classList.add('is-open');
                }
            });
    
            group.addEventListener('mouseleave', () => {
                if (window.innerWidth > 820) {
                    if (!group.classList.contains('is-pinned')) {
                        group.classList.remove('is-open');
                    }
                }
            });
        });
    
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.nav-group')) {
                closeAll();
            }
        });
    
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeAll();
            }
        });
    
        window.addEventListener('resize', () => {
            closeAll();
        });
    }

    function injectNavUser() {
        const area = document.getElementById('navUserArea');
        if (!area) return;
    
        const user = getStoredUser();
    
        if (!user) {
            area.innerHTML = `<a href="${window.APP_CONFIG.FRONTEND_BASE_URL}/login.php" class="btn btn-outline" id="navLoginBtn">Masuk</a>`;
            return;
        }
    
        const profileUrl = user.role === 'petugas'
            ? `${window.APP_CONFIG.FRONTEND_BASE_URL}/officer-profile.php`
            : `${window.APP_CONFIG.FRONTEND_BASE_URL}/profile.php`;
    
        area.innerHTML = `
            <div class="nav-group profile-group" style="position: relative;">
                <a href="${profileUrl}" class="nav-user-badge">
                    <span>👤</span>
                    <span>${escapeHtml(user.name || 'Pengguna')}</span>
                </a>
                <div class="profile-dropdown nav-dropdown" style="display: none; position: absolute; right: 0; min-width: 150px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; z-index: 100;">
                    <a href="${profileUrl}" style="display: block; padding: 10px 15px; text-decoration: none; color: #333;">Detail</a>
                    <a href="#" onclick="FinderApp.clearAuth(); window.location.href='${window.APP_CONFIG.FRONTEND_BASE_URL}/login.php'; return false;" style="display: block; padding: 10px 15px; text-decoration: none; color: #a22626; border-top: 1px solid #eee;">Log Out</a>
                </div>
            </div>
        `;

        const profileGroup = area.querySelector('.profile-group');
        const profileDropdown = area.querySelector('.profile-dropdown');
        if (profileGroup && profileDropdown) {
            profileGroup.addEventListener('mouseenter', () => {
                profileDropdown.style.display = 'block';
            });
            profileGroup.addEventListener('mouseleave', () => {
                profileDropdown.style.display = 'none';
            });
        }
    }

    function requireAuth(role = null) {
        const token = getStoredToken();
        const user = getStoredUser();
        if (!token || !user) {
            redirectToLogin('Silakan login terlebih dahulu.');
            return null;
        }

        if (role && user.role !== role) {
            const targetRole = user.role;
            redirectToRoleHome(targetRole, `Akun Anda masuk sebagai ${targetRole}. Halaman yang sesuai telah dibuka.`);
            return null;
        }

        return user;
    }

    function fileToPreviewHtml(url, alt = 'Preview') {
        if (!url) return '<div class="image-placeholder">Tidak ada foto</div>';
        let imageUrl = url;
        if (!imageUrl.startsWith('http')) {
            imageUrl = window.APP_CONFIG.API_BASE_URL + '/storage/' + imageUrl.replace(/^\/?(storage\/)?/, '');
        }
        return `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}" class="cover-image" style="cursor: pointer;" onclick="FinderApp.showImageLightbox(this.src, this.alt)">`;
    }

    function showImageLightbox(src, alt) {
        let lightbox = document.getElementById('finderImageLightbox');
        if (!lightbox) {
            lightbox = document.createElement('div');
            lightbox.id = 'finderImageLightbox';
            lightbox.className = 'finder-modal';
            lightbox.hidden = true;
            lightbox.innerHTML = `
                <div class="finder-modal-backdrop" data-close-modal style="background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);"></div>
                <button class="finder-modal-close" type="button" data-close-modal style="color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.5); z-index: 2;">&times;</button>
                <div class="lightbox-content" style="position: absolute; inset: 40px; display: flex; align-items: center; justify-content: center; pointer-events: none; z-index: 1;">
                    <img id="finderLightboxImg" src="" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain; pointer-events: auto; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                </div>
            `;
            document.body.appendChild(lightbox);
        }

        const img = document.getElementById('finderLightboxImg');
        img.src = src;
        img.alt = alt || 'Preview';

        openModal(lightbox);
    }

    window.FinderApp = {
        getStoredToken,
        getStoredUser,
        getRememberPreference,
        persistAuth,
        clearAuth,
        apiFetch,
        showToast,
        showAlert,
        consumeFlashMessage,
        getApiErrorMessage,
        formatDateTime,
        splitDateTime,
        combineDateTime,
        statusBadge,
        statusBadgeClass,
        formatStatus,
        escapeHtml,
        openModal,
        closeModal,
        requireAuth,
        redirectToRoleHome,
        getHomePathByRole,
        getProfilePathByRole,
        fileToPreviewHtml,
        showImageLightbox,
    };

    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.remove('finder-modal-open');
        document.body.style.overflow = '';
    
        document.querySelectorAll('.finder-modal').forEach((modal) => {
            if (!modal.hasAttribute('hidden')) {
                modal.hidden = true;
            }
            modal.setAttribute('aria-hidden', 'true');
        });
    
        bindModalEvents();
        bindPasswordToggles();
        bindMobileNav();
        bindOfficerDropdowns();
        bindNavGroups();
        injectNavUser();
        consumeFlashMessage();
    });
    
    window.addEventListener('pageshow', () => {
        syncBodyScrollLock();
    });
})();
