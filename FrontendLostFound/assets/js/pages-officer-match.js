document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const lostList = document.getElementById('matchLostList');
    const foundList = document.getElementById('matchFoundList');
    const matchList = document.getElementById('matchList');
    const matchState = document.getElementById('matchState');
    const lostSearchInput = document.getElementById('matchLostSearch');
    const foundSearchInput = document.getElementById('matchFoundSearch');
    const matchStatusFilter = document.getElementById('matchStatusFilter');
    const selectedLostLabel = document.getElementById('selectedLostLabel');
    const selectedFoundLabel = document.getElementById('selectedFoundLabel');
    const openCreateMatchBtn = document.getElementById('openCreateMatchBtn');
    const createLostPreview = document.getElementById('createMatchLostPreview');
    const createFoundPreview = document.getElementById('createMatchFoundPreview');
    const matchActionPhotoGroup = document.getElementById('matchActionPhotoGroup');
    const matchActionPhoto = document.getElementById('matchActionPhoto');
    let lostReports = [];
    let foundItems = [];
    let matches = [];
    let selectedLostId = null;
    let selectedFoundId = null;

    function updateSelectedLabels() {
        const lost = lostReports.find((item) => String(item.id) === String(selectedLostId));
        const found = foundItems.find((item) => String(item.id) === String(selectedFoundId));
        selectedLostLabel.textContent = lost ? `Lost: ${lost.nama_barang}` : 'Belum memilih laporan';
        selectedFoundLabel.textContent = found ? `Found: ${found.nama_barang}` : 'Belum memilih barang';
        openCreateMatchBtn.disabled = !(lost && found);
    }

    function renderLostList(items) {
        if (!items.length) {
            lostList.innerHTML = '<div class="helper-box">Tidak ada laporan yang siap dicocokkan.</div>';
            return;
        }
        lostList.innerHTML = items.map((item) => `
            <article class="match-select-card ${String(selectedLostId) === String(item.id) ? 'is-selected' : ''}" data-pick-lost="${item.id}">
                <div class="inline-row between wrap-gap">
                    <strong>${FinderApp.escapeHtml(item.nama_barang)}</strong>
                    ${FinderApp.statusBadge(item.status)}
                </div>
                <p>${FinderApp.escapeHtml(item.pelapor_name || '-')} • ${FinderApp.escapeHtml(item.lokasi || '-')}</p>
                <small>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_hilang))}</small>
            </article>
        `).join('');
    }

    function renderFoundList(items) {
        if (!items.length) {
            foundList.innerHTML = '<div class="helper-box">Tidak ada barang yang siap dicocokkan.</div>';
            return;
        }
        foundList.innerHTML = items.map((item) => `
            <article class="match-select-card ${String(selectedFoundId) === String(item.id) ? 'is-selected' : ''}" data-pick-found="${item.id}">
                <div class="inline-row between wrap-gap">
                    <strong>${FinderApp.escapeHtml(item.nama_barang)}</strong>
                    ${FinderApp.statusBadge(item.status)}
                </div>
                <p>${FinderApp.escapeHtml(item.lokasi || '-')}</p>
                <small>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_temuan))}</small>
            </article>
        `).join('');
    }

    function renderMatches(items) {
        if (!items.length) {
            matchState.classList.remove('hidden');
            matchState.textContent = 'Belum ada data pencocokan.';
            matchList.innerHTML = '';
            return;
        }
        matchState.classList.add('hidden');
        matchList.innerHTML = items.map((item) => `
            <article class="report-status-card">
                <div class="report-status-top">
                    <div class="report-status-main">
                        <h3>${FinderApp.escapeHtml(item.barang_temuan_nama)} ↔ ${FinderApp.escapeHtml(item.laporan_nama)}</h3>
                        <p>Pelapor: ${FinderApp.escapeHtml(item.pelapor_name || '-')} • Petugas: ${FinderApp.escapeHtml(item.petugas_name || '-')}</p>
                    </div>
                    ${FinderApp.statusBadge(item.status)}
                </div>
                <div class="meta-grid compact-grid">
                    <div class="meta-item"><span>Catatan</span><strong>${FinderApp.escapeHtml(item.catatan || '-')}</strong></div>
                    <div class="meta-item"><span>Waktu Serah</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.waktu_serah))}</strong></div>
                    <div class="meta-item"><span>Diperbarui</span><strong>${FinderApp.escapeHtml(FinderApp.formatDateTime(item.updated_at))}</strong></div>
                </div>
                ${item.foto_bukti_serah ? `
                    <div class="mt-16">
                        <span class="muted">Bukti Handover</span>
                        <div class="detail-box image-box mt-8">
                            ${FinderApp.fileToPreviewHtml(item.foto_bukti_serah, 'Bukti Handover')}
                        </div>
                    </div>
                ` : ''}
                <div class="report-actions mt-16">
                    ${item.status === 'pending' ? `<button type="button" class="btn btn-secondary" data-match-action="verify" data-match-id="${item.id}">Verify</button>` : ''}
                    ${item.status === 'diverifikasi' ? `<button type="button" class="btn btn-primary" data-match-action="handover" data-match-id="${item.id}">Handover</button>` : ''}
                    ${['pending', 'diverifikasi'].includes(item.status) ? `<button type="button" class="btn btn-outline danger-outline" data-match-action="cancel" data-match-id="${item.id}">Cancel</button>` : ''}
                </div>
            </article>
        `).join('');
    }

    async function loadSelectableData() {
        try {
            const lostParams = new URLSearchParams();
            lostParams.set('status', 'menunggu');
            if (lostSearchInput.value.trim()) lostParams.set('search', lostSearchInput.value.trim());
            const foundParams = new URLSearchParams();
            foundParams.set('status', 'tersimpan');
            if (foundSearchInput.value.trim()) foundParams.set('search', foundSearchInput.value.trim());

            const [lostRes, foundRes] = await Promise.all([
                FinderApp.apiFetch('/api/lost-reports?' + lostParams.toString()),
                FinderApp.apiFetch('/api/found-items?' + foundParams.toString()),
            ]);

            lostReports = lostRes?.data?.lost_reports || [];
            foundItems = foundRes?.data?.found_items || [];
            renderLostList(lostReports);
            renderFoundList(foundItems);
            updateSelectedLabels();
        } catch (error) {
            lostList.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat data left panel.'))}</div>`;
            foundList.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat data right panel.'))}</div>`;
        }
    }

    async function loadMatches() {
        matchState.classList.remove('hidden');
        matchState.innerHTML = '<div class="loading-spinner"></div>';
        try {
            const query = matchStatusFilter.value ? `?status=${encodeURIComponent(matchStatusFilter.value)}` : '';
            const response = await FinderApp.apiFetch('/api/matches' + query);
            matches = response?.data?.matches || [];
            renderMatches(matches);
        } catch (error) {
            matchState.classList.remove('hidden');
            matchState.textContent = FinderApp.getApiErrorMessage(error, 'Gagal memuat data match.');
        }
    }

    lostList.addEventListener('click', (event) => {
        const card = event.target.closest('[data-pick-lost]');
        if (!card) return;
        selectedLostId = card.getAttribute('data-pick-lost');
        renderLostList(lostReports);
        updateSelectedLabels();
    });

    foundList.addEventListener('click', (event) => {
        const card = event.target.closest('[data-pick-found]');
        if (!card) return;
        selectedFoundId = card.getAttribute('data-pick-found');
        renderFoundList(foundItems);
        updateSelectedLabels();
    });

    document.getElementById('refreshMatchLost').addEventListener('click', loadSelectableData);
    document.getElementById('refreshMatchFound').addEventListener('click', loadSelectableData);
    lostSearchInput.addEventListener('input', () => window.clearTimeout(lostSearchInput._t) || (lostSearchInput._t = setTimeout(loadSelectableData, 350)));
    foundSearchInput.addEventListener('input', () => window.clearTimeout(foundSearchInput._t) || (foundSearchInput._t = setTimeout(loadSelectableData, 350)));
    matchStatusFilter.addEventListener('change', loadMatches);
    document.getElementById('refreshMatchesBtn').addEventListener('click', loadMatches);

    openCreateMatchBtn.addEventListener('click', () => {
        const lost = lostReports.find((item) => String(item.id) === String(selectedLostId));
        const found = foundItems.find((item) => String(item.id) === String(selectedFoundId));
        if (!lost || !found) return;
        createLostPreview.innerHTML = `
            <span>Nama Barang</span><strong>${FinderApp.escapeHtml(lost.nama_barang)}</strong><br>
            <span>Lokasi</span><strong>${FinderApp.escapeHtml(lost.lokasi || '-')}</strong><br>
            <span>Deskripsi</span><strong>${FinderApp.escapeHtml(lost.deskripsi || '-')}</strong>
        `;
        createFoundPreview.innerHTML = `
            <span>Nama Barang</span><strong>${FinderApp.escapeHtml(found.nama_barang)}</strong><br>
            <span>Lokasi</span><strong>${FinderApp.escapeHtml(found.lokasi || '-')}</strong><br>
            <span>Deskripsi</span><strong>${FinderApp.escapeHtml(found.deskripsi || '-')}</strong>
        `;
        FinderApp.openModal('createMatchModal');
    });

    document.getElementById('confirmCreateMatchBtn').addEventListener('click', async () => {
        try {
            await FinderApp.apiFetch('/api/matches', {
                method: 'POST',
                body: {
                    barang_temuan_id: Number(selectedFoundId),
                    laporan_id: Number(selectedLostId),
                },
            });
            FinderApp.showToast('Match berhasil dibuat.', 'success');
            FinderApp.closeModal(document.getElementById('createMatchModal'));
            selectedLostId = null;
            selectedFoundId = null;
            await loadSelectableData();
            await loadMatches();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal membuat match.'), 'error');
        }
    });

    matchList.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-match-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-match-action');
        const id = btn.getAttribute('data-match-id');
        const titleMap = {
            verify: 'Verifikasi Klaim',
            handover: 'Catat Penyerahan Barang',
            cancel: 'Batalkan Pencocokan',
        };
        document.getElementById('matchActionId').value = id;
        document.getElementById('matchActionType').value = action;
        document.getElementById('matchActionTitle').textContent = titleMap[action] || 'Proses Match';
        document.getElementById('matchActionSubmitBtn').textContent = action === 'handover' ? 'Selesaikan Handover' : (action === 'cancel' ? 'Batalkan Match' : 'Verifikasi');
        document.getElementById('matchActionNote').value = '';
        matchActionPhoto.value = '';

        if (action === 'handover') {
            matchActionPhotoGroup.classList.remove('hidden');
            matchActionPhoto.required = true;
        } else {
            matchActionPhotoGroup.classList.add('hidden');
            matchActionPhoto.required = false;
        }

        FinderApp.openModal('matchActionModal');
    });

    document.getElementById('matchActionForm').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const id = document.getElementById('matchActionId').value;
        const action = document.getElementById('matchActionType').value;
        const note = document.getElementById('matchActionNote').value.trim();
        const btn = document.getElementById('matchActionSubmitBtn');
    
        const buttonLabelMap = {
            verify: 'Verifikasi',
            handover: 'Selesaikan Handover',
            cancel: 'Batalkan Match',
        };
    
        btn.disabled = true;
        btn.textContent = 'Memproses...';
    
        const endpointMap = {
            verify: `/api/matches/${id}/verify`,
            handover: `/api/matches/${id}/handover`,
            cancel: `/api/matches/${id}/cancel`,
        };
    
        try {
            if (action === 'handover') {
                const file = matchActionPhoto.files[0];
    
                if (!file) {
                    FinderApp.showToast('Foto bukti handover wajib diunggah.', 'error');
                    btn.disabled = false;
                    btn.textContent = buttonLabelMap[action];
                    return;
                }
    
                if (file.size > 5 * 1024 * 1024) {
                    FinderApp.showToast('Ukuran foto maksimal 5 MB.', 'error');
                    btn.disabled = false;
                    btn.textContent = buttonLabelMap[action];
                    return;
                }
    
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('catatan', note);
                formData.append('foto_bukti_serah', file);
    
                await FinderApp.apiFetch(endpointMap[action], {
                    method: 'POST',
                    body: formData,
                });
            } else {
                await FinderApp.apiFetch(endpointMap[action], {
                    method: 'PUT',
                    body: { catatan: note },
                });
            }
    
            FinderApp.showToast('Aksi match berhasil diproses.', 'success');
            FinderApp.closeModal(document.getElementById('matchActionModal'));
            await loadSelectableData();
            await loadMatches();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal memproses aksi match.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = buttonLabelMap[action] || 'Simpan';
        }
    });

    loadSelectableData();
    loadMatches();
});
