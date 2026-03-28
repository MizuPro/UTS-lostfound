document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('pelapor');
    if (!user) return;

    const grid = document.getElementById('foundGrid');
    const state = document.getElementById('foundListState');
    const form = document.getElementById('foundSearchForm');
    const resetBtn = document.getElementById('resetFoundSearch');
    const modalContent = document.getElementById('foundDetailContent');
    const searchInput = document.getElementById('searchFound');
    const statusInput = document.getElementById('statusFound');

    async function loadItems(params = new URLSearchParams()) {
        state.classList.remove('hidden');
        state.innerHTML = '<div class="loading-spinner"></div>';
        grid.innerHTML = '';

        try {
            const apiParams = new URLSearchParams(params);
            const uiStatus = apiParams.get('status') || '';
            if (uiStatus === 'semua') {
                apiParams.delete('status');
            }

            const query = apiParams.toString() ? `?${apiParams.toString()}` : '';
            const response = await FinderApp.apiFetch('/api/found-items' + query);
            let items = response?.data?.found_items || [];

            if (uiStatus === '') {
                items = items.filter(item => item.status !== 'selesai');
            }

            if (!items.length) {
                state.classList.remove('hidden');
                state.textContent = 'Belum ada barang temuan petugas saat ini.';
                return;
            }

            state.classList.add('hidden');
            grid.innerHTML = items.map((item) => `
                <article class="found-card">
                    <div class="found-card-media">Preview Aman</div>
                    <div class="found-card-body">
                        <div class="inline-row between">
                            <h3>${FinderApp.escapeHtml(item.nama_barang)}</h3>
                            ${FinderApp.statusBadge(item.status)}
                        </div>
                        <p>Waktu ditemukan: ${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_temuan))}</p>
                        <p>Data detail sengaja dibatasi untuk role pelapor.</p>
                        <div class="card-footer-row">
                            <button class="btn btn-outline btn-sm" data-found-id="${item.id}">More &raquo;</button>
                        </div>
                    </div>
                </article>
            `).join('');
        } catch (error) {
            state.classList.remove('hidden');
            state.textContent = FinderApp.getApiErrorMessage(error, 'Gagal memuat data barang temuan.');
        }
    }

    grid.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-found-id]');
        if (!button) return;

        const id = button.getAttribute('data-found-id');
        modalContent.innerHTML = '<div class="loading-spinner"></div>';
        FinderApp.openModal('foundDetailModal');

        try {
            const response = await FinderApp.apiFetch(`/api/found-items/${id}`);
            const item = response?.data?.found_item;
            modalContent.innerHTML = `
                <div class="detail-box"><span>Nama Barang</span><strong>${FinderApp.escapeHtml(item.nama_barang)}</strong></div>
                <div class="detail-box"><span>Waktu Temuan</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_temuan))}</strong></div>
                <div class="detail-box"><span>Status</span><strong>${FinderApp.escapeHtml(item.status)}</strong></div>
                <div class="helper-box">Lokasi, deskripsi lengkap, dan foto tidak dikirim backend untuk role pelapor demi keamanan proses klaim.</div>
            `;
        } catch (error) {
            modalContent.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat detail barang.'))}</div>`;
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const params = new URLSearchParams();
        const search = searchInput.value.trim();
        const status = statusInput.value;
        if (search) params.set('search', search);
        if (status) params.set('status', status);
        loadItems(params);
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        loadItems();
    });

    loadItems();
});
