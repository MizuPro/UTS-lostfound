document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('pelapor');
    if (!user) return;

    const profileNameText = document.getElementById('profileNameText');
    const profileInfoBox = document.getElementById('profileInfoBox');
    const reportListState = document.getElementById('reportListState');
    const reportCards = document.getElementById('reportCards');
    const editNameInput = document.getElementById('editName');
    const editEmailInput = document.getElementById('editEmail');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = {
        profile: document.getElementById('profileTab'),
        reports: document.getElementById('reportsTab'),
    };
    let currentReports = [];

    profileNameText.textContent = user?.name || 'Pengguna';

    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            tabButtons.forEach((btn) => btn.classList.remove('is-active'));
            button.classList.add('is-active');
            const target = button.dataset.tab;
            Object.entries(tabPanels).forEach(([key, panel]) => {
                panel.classList.toggle('is-active', key === target);
            });
        });
    });

    async function loadProfile() {
        try {
            const response = await FinderApp.apiFetch('/api/auth/me');
            const me = response?.data?.user || user;
            profileNameText.textContent = me.name || 'Pengguna';
            profileInfoBox.innerHTML = `
                <div class="profile-data-item"><strong>Nama</strong><span>${FinderApp.escapeHtml(me.name || '-')}</span></div>
                <div class="profile-data-item"><strong>Email</strong><span>${FinderApp.escapeHtml(me.email || '-')}</span></div>
                <div class="profile-data-item"><strong>Role</strong><span>${FinderApp.escapeHtml(me.role || '-')}</span></div>
                <div class="profile-data-item"><strong>Dibuat</strong><span>${FinderApp.escapeHtml(FinderApp.formatDateTime(me.created_at))}</span></div>
            `;
            editNameInput.value = me.name || '';
            editEmailInput.value = me.email || '';
            const savedUser = FinderApp.getStoredUser() || {};
            FinderApp.persistAuth(FinderApp.getStoredToken(), { ...savedUser, ...me }, FinderApp.getRememberPreference());
        } catch (error) {
            profileInfoBox.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat profil.'))}</div>`;
        }
    }

    function renderReports(reports) {
        if (!reports.length) {
            reportListState.classList.remove('hidden');
            reportListState.textContent = 'Anda belum pernah melakukan laporan kehilangan.';
            reportCards.innerHTML = '';
            return;
        }

        reportListState.classList.add('hidden');
        reportCards.innerHTML = reports.map((report) => `
            <article class="report-status-card">
                <div class="report-status-top">
                    <div class="report-status-main">
                        <h3>${FinderApp.escapeHtml(report.nama_barang)}</h3>
                        <p>${FinderApp.escapeHtml(report.deskripsi || 'Tidak ada deskripsi tambahan.')}</p>
                    </div>
                    ${FinderApp.statusBadge(report.status)}
                </div>
                <div class="meta-grid">
                    <div class="meta-item"><span>Lokasi</span><strong>${FinderApp.escapeHtml(report.lokasi || '-')}</strong></div>
                    <div class="meta-item"><span>Waktu Hilang</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(report.waktu_hilang))}</strong></div>
                    <div class="meta-item"><span>Diperbarui</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(report.updated_at))}</strong></div>
                </div>
                <div class="report-actions">
                    <button type="button" class="btn btn-outline" data-detail-report="${report.id}">Lihat Detail</button>
                    ${report.status === 'menunggu' ? `<button type="button" class="btn btn-secondary" data-edit-report="${report.id}">Edit / Tutup</button>` : ''}
                </div>
            </article>
        `).join('');
    }

    async function loadReports() {
        reportListState.classList.remove('hidden');
        reportListState.innerHTML = '<div class="loading-spinner"></div>';
        reportCards.innerHTML = '';
        try {
            const response = await FinderApp.apiFetch('/api/lost-reports');
            currentReports = response?.data?.lost_reports || [];
            renderReports(currentReports);
        } catch (error) {
            reportListState.classList.remove('hidden');
            reportListState.textContent = FinderApp.getApiErrorMessage(error, 'Gagal memuat laporan.');
        }
    }

    function findReport(id) {
        return currentReports.find((item) => String(item.id) === String(id));
    }

    document.getElementById('refreshReportsBtn').addEventListener('click', loadReports);
    document.getElementById('openEditProfileBtn').addEventListener('click', () => FinderApp.openModal('editProfileModal'));
    document.getElementById('openChangePasswordBtn').addEventListener('click', () => FinderApp.openModal('changePasswordModal'));
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try { await FinderApp.apiFetch('/api/auth/logout', { method: 'POST' }); } catch (_) {}
        FinderApp.clearAuth();
        sessionStorage.setItem('finder_flash_message', 'Logout berhasil.');
        window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + '/login.php';
    });

    document.getElementById('editProfileForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Menyimpan...';
        try {
            const response = await FinderApp.apiFetch('/api/auth/profile', {
                method: 'PUT',
                body: {
                    name: editNameInput.value.trim(),
                    email: editEmailInput.value.trim(),
                }
            });
            const updatedUser = response?.data?.user || {};
            FinderApp.persistAuth(FinderApp.getStoredToken(), { ...(FinderApp.getStoredUser() || {}), ...updatedUser }, FinderApp.getRememberPreference());
            FinderApp.showToast('Profil berhasil diperbarui.', 'success');
            FinderApp.closeModal(document.getElementById('editProfileModal'));
            loadProfile();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal memperbarui profil.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Simpan Perubahan';
        }
    });

    document.getElementById('changePasswordForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Memproses...';
        try {
            await FinderApp.apiFetch('/api/auth/change-password', {
                method: 'PUT',
                body: {
                    current_password: currentPasswordInput.value,
                    new_password: newPasswordInput.value,
                }
            });
            FinderApp.showToast('Password berhasil diubah. Silakan login ulang.', 'success', 4500);
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

    reportCards.addEventListener('click', (event) => {
        const detailBtn = event.target.closest('[data-detail-report]');
        const editBtn = event.target.closest('[data-edit-report]');

        if (detailBtn) {
            const report = findReport(detailBtn.getAttribute('data-detail-report'));
            if (!report) return;
            const detailContent = document.getElementById('reportDetailContent');
            detailContent.innerHTML = `
                <div class="detail-box"><span>Nama Barang</span><strong>${FinderApp.escapeHtml(report.nama_barang)}</strong></div>
                <div class="detail-box"><span>Status</span><strong>${FinderApp.escapeHtml(report.status)}</strong></div>
                <div class="detail-box"><span>Lokasi</span><strong>${FinderApp.escapeHtml(report.lokasi)}</strong></div>
                <div class="detail-box"><span>Waktu Hilang</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(report.waktu_hilang))}</strong></div>
                <div class="detail-box"><span>Deskripsi</span><strong>${FinderApp.escapeHtml(report.deskripsi || '-')}</strong></div>
            `;
            FinderApp.openModal('reportDetailModal');
        }

        if (editBtn) {
            const report = findReport(editBtn.getAttribute('data-edit-report'));
            if (!report) return;
            const dt = FinderApp.splitDateTime(report.waktu_hilang);
            document.getElementById('editReportId').value = report.id;
            document.getElementById('editReportName').value = report.nama_barang || '';
            document.getElementById('editReportDate').value = dt.date;
            document.getElementById('editReportTime').value = dt.time;
            document.getElementById('editReportLocation').value = report.lokasi || '';
            document.getElementById('editReportDescription').value = report.deskripsi || '';
            document.getElementById('editReportStatus').value = report.status || 'menunggu';
            FinderApp.openModal('editReportModal');
        }
    });

    document.getElementById('editReportForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const btn = form.querySelector('button[type="submit"]');
        const id = document.getElementById('editReportId').value;
        const waktuHilang = FinderApp.combineDateTime(
            document.getElementById('editReportDate').value,
            document.getElementById('editReportTime').value
        );

        btn.disabled = true;
        btn.textContent = 'Menyimpan...';
        try {
            await FinderApp.apiFetch(`/api/lost-reports/${id}`, {
                method: 'PUT',
                body: {
                    nama_barang: document.getElementById('editReportName').value.trim(),
                    deskripsi: document.getElementById('editReportDescription').value.trim(),
                    lokasi: document.getElementById('editReportLocation').value.trim(),
                    waktu_hilang: waktuHilang,
                    status: document.getElementById('editReportStatus').value,
                }
            });
            FinderApp.showToast('Laporan berhasil diperbarui.', 'success');
            FinderApp.closeModal(document.getElementById('editReportModal'));
            loadReports();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal memperbarui laporan.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Simpan Perubahan';
        }
    });

    loadProfile();
    loadReports();
});
