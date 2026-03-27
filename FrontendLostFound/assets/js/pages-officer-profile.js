document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const profileNameText = document.getElementById('officerProfileNameText');
    const profileInfoBox = document.getElementById('officerProfileInfoBox');
    const overviewCards = document.getElementById('officerOverviewCards');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = {
        profile: document.getElementById('profileTab'),
        overview: document.getElementById('overviewTab'),
    };

    profileNameText.textContent = user?.name || 'Petugas';

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            tabButtons.forEach((btn) => btn.classList.remove('is-active'));
            button.classList.add('is-active');
            const target = button.dataset.tab;
            Object.entries(tabPanels).forEach(([key, panel]) => panel.classList.toggle('is-active', key === target));
        });
    });

    async function loadProfile() {
        try {
            const response = await FinderApp.apiFetch('/api/auth/me');
            const me = response?.data?.user || user;
            profileNameText.textContent = me.name || 'Petugas';
            profileInfoBox.innerHTML = `
                <div class="profile-data-item"><strong>Nama</strong><span>${FinderApp.escapeHtml(me.name || '-')}</span></div>
                <div class="profile-data-item"><strong>Email</strong><span>${FinderApp.escapeHtml(me.email || '-')}</span></div>
                <div class="profile-data-item"><strong>Role</strong><span>${FinderApp.escapeHtml(me.role || '-')}</span></div>
                <div class="profile-data-item"><strong>Dibuat</strong><span>${FinderApp.escapeHtml(FinderApp.formatDateTime(me.created_at))}</span></div>
            `;
            document.getElementById('officerEditName').value = me.name || '';
            document.getElementById('officerEditEmail').value = me.email || '';
            FinderApp.persistAuth(FinderApp.getStoredToken(), { ...(FinderApp.getStoredUser() || {}), ...me }, FinderApp.getRememberPreference());
        } catch (error) {
            profileInfoBox.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat profil.'))}</div>`;
        }
    }

    async function loadOverview() {
        try {
            const [foundRes, lostRes, matchRes] = await Promise.all([
                FinderApp.apiFetch('/api/found-items/ongoing'),
                FinderApp.apiFetch('/api/lost-reports?status=menunggu'),
                FinderApp.apiFetch('/api/matches?status=pending'),
            ]);
            overviewCards.innerHTML = `
                <article class="metric-card"><strong>${(foundRes?.data?.found_items || []).length}</strong><span>Barang temuan aktif</span></article>
                <article class="metric-card"><strong>${(lostRes?.data?.lost_reports || []).length}</strong><span>Laporan menunggu</span></article>
                <article class="metric-card"><strong>${(matchRes?.data?.matches || []).length}</strong><span>Match pending</span></article>
            `;
        } catch (error) {
            overviewCards.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat ringkasan.'))}</div>`;
        }
    }

    document.getElementById('openOfficerEditProfileBtn').addEventListener('click', () => FinderApp.openModal('officerEditProfileModal'));
    document.getElementById('openOfficerChangePasswordBtn').addEventListener('click', () => FinderApp.openModal('officerChangePasswordModal'));
    document.getElementById('officerLogoutBtn').addEventListener('click', async () => {
        try { await FinderApp.apiFetch('/api/auth/logout', { method: 'POST' }); } catch (_) {}
        FinderApp.clearAuth();
        sessionStorage.setItem('finder_flash_message', 'Logout berhasil.');
        window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + '/login.php';
    });

    document.getElementById('officerEditProfileForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const btn = event.currentTarget.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Menyimpan...';
        try {
            const response = await FinderApp.apiFetch('/api/auth/profile', {
                method: 'PUT',
                body: {
                    name: document.getElementById('officerEditName').value.trim(),
                    email: document.getElementById('officerEditEmail').value.trim(),
                },
            });
            FinderApp.persistAuth(FinderApp.getStoredToken(), { ...(FinderApp.getStoredUser() || {}), ...(response?.data?.user || {}) }, FinderApp.getRememberPreference());
            FinderApp.showToast('Profil berhasil diperbarui.', 'success');
            FinderApp.closeModal(document.getElementById('officerEditProfileModal'));
            loadProfile();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal memperbarui profil.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Simpan Perubahan';
        }
    });

    document.getElementById('officerChangePasswordForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const btn = event.currentTarget.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Memproses...';
        try {
            await FinderApp.apiFetch('/api/auth/change-password', {
                method: 'PUT',
                body: {
                    current_password: document.getElementById('officerCurrentPassword').value,
                    new_password: document.getElementById('officerNewPassword').value,
                },
            });
            FinderApp.showToast('Password berhasil diubah. Silakan login ulang.', 'success');
            FinderApp.clearAuth();
            setTimeout(() => {
                sessionStorage.setItem('finder_flash_message', 'Password berhasil diubah. Silakan login ulang.');
                window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + '/login.php';
            }, 900);
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal mengubah password.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Submit';
        }
    });

    loadProfile();
    loadOverview();
});
