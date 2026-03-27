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
                if (group !== except) group.classList.remove('is-open');
            });
        }
    
        groups.forEach((group) => {
            const toggle = group.querySelector('.nav-group-toggle');
            const dropdown = group.querySelector('.nav-dropdown');
            if (!toggle || !dropdown) return;
    
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
    
                const isOpen = group.classList.contains('is-open');
                closeAll();
    
                if (!isOpen) {
                    group.classList.add('is-open');
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
                    group.classList.remove('is-open');
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
            <a href="${profileUrl}" class="nav-user-badge">
                <span>👤</span>
                <span>${escapeHtml(user.name || 'Pengguna')}</span>
            </a>
        `;
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
        return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" class="cover-image">`;
    }

    window.FinderApp = {
        getStoredToken,
        getStoredUser,
        getRememberPreference,
        persistAuth,
        clearAuth,
        apiFetch,
        showToast,
        consumeFlashMessage,
        getApiErrorMessage,
        formatDateTime,
        splitDateTime,
        combineDateTime,
        statusBadge,
        statusBadgeClass,
        escapeHtml,
        openModal,
        closeModal,
        requireAuth,
        redirectToRoleHome,
        getHomePathByRole,
        getProfilePathByRole,
        fileToPreviewHtml,
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
