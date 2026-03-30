document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const state = document.getElementById('officerLostState');
    const grid = document.getElementById('officerLostGrid');
    const form = document.getElementById('officerLostSearchForm');
    const searchInput = document.getElementById('officerLostSearch');
    const statusInput = document.getElementById('officerLostStatus');
    const locationInput = document.getElementById('officerLostLocationFilter');
    const resetBtn = document.getElementById('resetOfficerLostSearch');
    const detailContent = document.getElementById('officerLostDetailContent');
    let reports = [];

    function findReport(id) {
        return reports.find((item) => String(item.id) === String(id));
    }

    function renderReports(items) {
        if (!items.length) {
            state.classList.remove('hidden');
            state.textContent = 'Belum ada laporan kehilangan.';
            grid.innerHTML = '';
            return;
        }

        state.classList.add('hidden');
        grid.innerHTML = items.map((item) => `
            <article class="officer-card">
                <div class="image-media" style="margin-bottom: 16px; border-radius: 14px; overflow: hidden; max-height: 180px;">${FinderApp.fileToPreviewHtml(item.foto_path, item.nama_barang)}</div>
                <div class="inline-row between wrap-gap">
                    <div>
                        <h3>${FinderApp.escapeHtml(item.nama_barang)}</h3>
                        <p class="muted">Pelapor: ${FinderApp.escapeHtml(item.pelapor_name || '-')} • ${FinderApp.escapeHtml(item.pelapor_email || '-')}</p>
                    </div>
                    ${FinderApp.statusBadge(item.status)}
                </div>
                <div class="meta-grid mt-16">
                    <div class="meta-item"><span>Lokasi</span><strong>${FinderApp.escapeHtml(item.lokasi || '-')}</strong></div>
                    <div class="meta-item"><span>Waktu Hilang</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_hilang))}</strong></div>
                    <div class="meta-item"><span>Diperbarui</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.updated_at))}</strong></div>
                </div>
                <div class="report-actions mt-16">
                    <button type="button" class="btn btn-outline" data-lost-detail="${item.id}">Detail</button>
                    ${!['selesai', 'ditutup'].includes(item.status) ? `<button type="button" class="btn btn-secondary" data-lost-edit="${item.id}">Edit</button>` : ''}
                    <button type="button" class="btn btn-outline danger-outline" data-lost-delete="${item.id}">Hapus</button>
                </div>
            </article>
        `).join('');
    }

    async function loadReports(params = new URLSearchParams()) {
        state.classList.remove('hidden');
        state.innerHTML = '<div class="loading-spinner"></div>';
        grid.innerHTML = '';

        try {
            const query = params.toString() ? `?${params.toString()}` : '';
            const response = await FinderApp.apiFetch('/api/lost-reports' + query);
            reports = response?.data?.lost_reports || [];
            renderReports(reports);
        } catch (error) {
            state.classList.remove('hidden');
            state.textContent = FinderApp.getApiErrorMessage(error, 'Gagal memuat laporan kehilangan.');
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
        if (statusInput.value) params.set('status', statusInput.value);
        if (locationInput.value.trim()) params.set('lokasi', locationInput.value.trim());
        loadReports(params);
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        loadReports();
    });

    grid.addEventListener('click', async (event) => {
        const detailBtn = event.target.closest('[data-lost-detail]');
        const editBtn = event.target.closest('[data-lost-edit]');
        const deleteBtn = event.target.closest('[data-lost-delete]');

        if (detailBtn) {
            const report = findReport(detailBtn.getAttribute('data-lost-detail'));
            if (!report) return;
            detailContent.innerHTML = `
                <div class="detail-box image-box">${FinderApp.fileToPreviewHtml(report.foto_path, report.nama_barang)}</div>
                <div class="detail-box"><span>Nama Barang</span><strong>${FinderApp.escapeHtml(report.nama_barang)}</strong></div>
                <div class="detail-box"><span>Pelapor</span><strong>${FinderApp.escapeHtml(report.pelapor_name || '-')} | ${FinderApp.escapeHtml(report.pelapor_email || '-')}</strong></div>
                <div class="detail-box"><span>Status</span><strong>${FinderApp.escapeHtml(report.status)}</strong></div>
                <div class="detail-box"><span>Lokasi</span><strong>${FinderApp.escapeHtml(report.lokasi || '-')}</strong></div>
                <div class="detail-box"><span>Waktu Hilang</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(report.waktu_hilang))}</strong></div>
                <div class="detail-box"><span>Deskripsi</span><strong>${FinderApp.escapeHtml(report.deskripsi || '-')}</strong></div>
            `;
            FinderApp.openModal('officerLostDetailModal');
        }

        if (editBtn) {
            const report = findReport(editBtn.getAttribute('data-lost-edit'));
            if (!report) return;
            const dt = FinderApp.splitDateTime(report.waktu_hilang);
            document.getElementById('officerEditLostId').value = report.id;
            document.getElementById('officerEditLostName').value = report.nama_barang || '';
            document.getElementById('officerEditLostDate').value = dt.date;
            document.getElementById('officerEditLostTime').value = dt.time;
            document.getElementById('officerEditLostLocation').value = report.lokasi || '';
            document.getElementById('officerEditLostDescription').value = report.deskripsi || '';
            document.getElementById('officerEditLostStatus').value = report.status || 'menunggu';
            FinderApp.openModal('officerLostEditModal');
        }

        if (deleteBtn) {
            const id = deleteBtn.getAttribute('data-lost-delete');
            if (!confirm('Hapus laporan ini secara permanen?')) return;
            try {
                await FinderApp.apiFetch(`/api/lost-reports/${id}`, { method: 'DELETE' });
                FinderApp.showToast('Laporan berhasil dihapus.', 'success');
                loadReports();
            } catch (error) {
                FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal menghapus laporan.'), 'error');
            }
        }
    });

    document.getElementById('officerLostEditForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const btn = event.currentTarget.querySelector('button[type="submit"]');
        const id = document.getElementById('officerEditLostId').value;
        const waktu = FinderApp.combineDateTime(
            document.getElementById('officerEditLostDate').value,
            document.getElementById('officerEditLostTime').value
        );

        btn.disabled = true;
        btn.textContent = 'Menyimpan...';
        try {
            await FinderApp.apiFetch(`/api/lost-reports/${id}`, {
                method: 'PUT',
                body: {
                    nama_barang: document.getElementById('officerEditLostName').value.trim(),
                    deskripsi: document.getElementById('officerEditLostDescription').value.trim(),
                    lokasi: document.getElementById('officerEditLostLocation').value.trim(),
                    waktu_hilang: waktu,
                    status: document.getElementById('officerEditLostStatus').value,
                },
            });
            FinderApp.showToast('Laporan berhasil diperbarui.', 'success');
            FinderApp.closeModal(document.getElementById('officerLostEditModal'));
            loadReports();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal memperbarui laporan.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Simpan Perubahan';
        }
    });

    loadReports();
});
