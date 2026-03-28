document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const state = document.getElementById('officerFoundState');
    const grid = document.getElementById('officerFoundGrid');
    const form = document.getElementById('officerFoundSearchForm');
    const searchInput = document.getElementById('officerFoundSearch');
    const statusInput = document.getElementById('officerFoundStatus');
    const locationInput = document.getElementById('officerFoundLocationFilter');
    const resetBtn = document.getElementById('resetOfficerFoundSearch');
    const detailContent = document.getElementById('officerFoundDetailContent');
    let items = [];

    function findItem(id) {
        return items.find((item) => String(item.id) === String(id));
    }

    function renderItems(list) {
        if (!list.length) {
            state.classList.remove('hidden');
            state.textContent = 'Belum ada barang temuan.';
            grid.innerHTML = '';
            return;
        }

        state.classList.add('hidden');
        grid.innerHTML = list.map((item) => `
            <article class="found-card officer-found-card">
                <div class="found-card-media image-media">${FinderApp.fileToPreviewHtml(item.foto_path, item.nama_barang)}</div>
                <div class="found-card-body">
                    <div class="inline-row between wrap-gap">
                        <h3>${FinderApp.escapeHtml(item.nama_barang)}</h3>
                        ${FinderApp.statusBadge(item.status)}
                    </div>
                    <p>${FinderApp.escapeHtml(item.deskripsi || 'Tidak ada deskripsi tambahan.')}</p>
                    <div class="meta-grid compact-grid mt-16">
                        <div class="meta-item"><span>Lokasi</span><strong>${FinderApp.escapeHtml(item.lokasi || '-')}</strong></div>
                        <div class="meta-item"><span>Waktu</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_temuan))}</strong></div>
                    </div>
                    <div class="report-actions mt-16">
                        <button type="button" class="btn btn-outline" data-found-detail="${item.id}">Detail</button>
                        ${item.status !== 'selesai' ? `<button type="button" class="btn btn-secondary" data-found-edit="${item.id}">Edit</button>` : ''}
                        ${item.status !== 'selesai' ? `<button type="button" class="btn btn-outline danger-outline" data-found-archive="${item.id}">Arsipkan</button>` : ''}
                    </div>
                </div>
            </article>
        `).join('');
    }

    async function loadItems(params = new URLSearchParams()) {
        state.classList.remove('hidden');
        state.innerHTML = '<div class="loading-spinner"></div>';
        grid.innerHTML = '';
        try {
            const query = params.toString() ? `?${params.toString()}` : '';
            const response = await FinderApp.apiFetch('/api/found-items' + query);
            items = response?.data?.found_items || [];
            renderItems(items);
        } catch (error) {
            state.classList.remove('hidden');
            state.textContent = FinderApp.getApiErrorMessage(error, 'Gagal memuat barang temuan.');
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
        if (statusInput.value) params.set('status', statusInput.value);
        if (locationInput.value.trim()) params.set('lokasi', locationInput.value.trim());
        loadItems(params);
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        loadItems();
    });

    grid.addEventListener('click', (event) => {
        const detailBtn = event.target.closest('[data-found-detail]');
        const editBtn = event.target.closest('[data-found-edit]');
        const archiveBtn = event.target.closest('[data-found-archive]');

        if (detailBtn) {
            const item = findItem(detailBtn.getAttribute('data-found-detail'));
            if (!item) return;
            detailContent.innerHTML = `
                <div class="detail-box image-box">${FinderApp.fileToPreviewHtml(item.foto_path, item.nama_barang)}</div>
                <div class="detail-box"><span>Nama Barang</span><strong>${FinderApp.escapeHtml(item.nama_barang)}</strong></div>
                <div class="detail-box"><span>Status</span><strong>${FinderApp.escapeHtml(item.status)}</strong></div>
                <div class="detail-box"><span>Lokasi</span><strong>${FinderApp.escapeHtml(item.lokasi || '-')}</strong></div>
                <div class="detail-box"><span>Waktu Temuan</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_temuan))}</strong></div>
                <div class="detail-box"><span>Deskripsi</span><strong>${FinderApp.escapeHtml(item.deskripsi || '-')}</strong></div>
                <div class="detail-box"><span>Catatan Selesai</span><strong>${FinderApp.escapeHtml(item.catatan_selesai || '-')}</strong></div>
            `;
            FinderApp.openModal('officerFoundDetailModal');
        }

        if (editBtn) {
            const item = findItem(editBtn.getAttribute('data-found-edit'));
            if (!item) return;
            const dt = FinderApp.splitDateTime(item.waktu_temuan);
            document.getElementById('officerEditFoundId').value = item.id;
            document.getElementById('officerEditFoundName').value = item.nama_barang || '';
            document.getElementById('officerEditFoundDate').value = dt.date;
            document.getElementById('officerEditFoundTime').value = dt.time;
            document.getElementById('officerEditFoundLocation').value = item.lokasi || '';
            document.getElementById('officerEditFoundDescription').value = item.deskripsi || '';
            document.getElementById('officerEditFoundStatus').value = item.status || 'tersimpan';
            document.getElementById('officerEditFoundPhoto').value = '';
            FinderApp.openModal('officerFoundEditModal');
        }

        if (archiveBtn) {
            const item = findItem(archiveBtn.getAttribute('data-found-archive'));
            if (!item) return;
            document.getElementById('officerArchiveFoundId').value = item.id;
            document.getElementById('officerArchiveFoundNote').value = item.catatan_selesai || '';
            FinderApp.openModal('officerFoundArchiveModal');
        }
    });

    document.getElementById('officerFoundEditForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const btn = event.currentTarget.querySelector('button[type="submit"]');
        const id = document.getElementById('officerEditFoundId').value;
        const waktu = FinderApp.combineDateTime(
            document.getElementById('officerEditFoundDate').value,
            document.getElementById('officerEditFoundTime').value
        );
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('nama_barang', document.getElementById('officerEditFoundName').value.trim());
        formData.append('deskripsi', document.getElementById('officerEditFoundDescription').value.trim());
        formData.append('lokasi', document.getElementById('officerEditFoundLocation').value.trim());
        formData.append('waktu_temuan', waktu);
        formData.append('status', document.getElementById('officerEditFoundStatus').value);
        const file = document.getElementById('officerEditFoundPhoto').files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                FinderApp.showToast('Ukuran foto terlalu besar. Maksimal 5MB.', 'error');
                btn.disabled = false;
                btn.textContent = 'Simpan Perubahan';
                return;
            }
            formData.append('foto', file);
        }

        btn.disabled = true;
        btn.textContent = 'Menyimpan...';
        try {
            await FinderApp.apiFetch(`/api/found-items/${id}`, {
                method: 'POST',
                body: formData,
            });
            FinderApp.showToast('Barang temuan berhasil diperbarui.', 'success');
            FinderApp.closeModal(document.getElementById('officerFoundEditModal'));
            loadItems();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal memperbarui barang temuan.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Simpan Perubahan';
        }
    });

    document.getElementById('officerFoundArchiveForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const btn = event.currentTarget.querySelector('button[type="submit"]');
        const id = document.getElementById('officerArchiveFoundId').value;
        btn.disabled = true;
        btn.textContent = 'Mengarsipkan...';
        try {
            await FinderApp.apiFetch(`/api/found-items/${id}/archive`, {
                method: 'PATCH',
                body: { catatan_selesai: document.getElementById('officerArchiveFoundNote').value.trim() },
            });
            FinderApp.showToast('Barang temuan berhasil diarsipkan.', 'success');
            FinderApp.closeModal(document.getElementById('officerFoundArchiveModal'));
            loadItems();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal mengarsipkan barang.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Arsipkan';
        }
    });

    loadItems();
});
