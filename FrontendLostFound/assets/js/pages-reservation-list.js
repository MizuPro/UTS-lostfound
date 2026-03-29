document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('pelapor');
    if (!user) return;

    const matchSelect = document.getElementById('matchSelect');
    const form = document.getElementById('proposeScheduleForm');
    const scheduleDate = document.getElementById('scheduleDate');
    const scheduleTime = document.getElementById('scheduleTime');
    const scheduleLocation = document.getElementById('scheduleLocation');
    const scheduleNote = document.getElementById('scheduleNote');
    const scheduleListContainer = document.getElementById('scheduleListContainer');
    const scheduleLoadingIndicator = document.getElementById('scheduleLoadingIndicator');

    let verifiedMatches = [];

    async function loadMatchesForSchedule() {
        try {
            matchSelect.disabled = true;

            // First get all matches for this user (which implies they are the pelapor)
            const response = await FinderApp.apiFetch('/api/matches');
            const matches = response?.data?.matches || [];

            // Allow scheduling only for diverifikasi
            verifiedMatches = matches.filter(m => m.status === 'diverifikasi');

            if (verifiedMatches.length === 0) {
                matchSelect.innerHTML = '<option value="">-- Tidak ada match yang diverifikasi --</option>';
            } else {
                matchSelect.innerHTML = '<option value="">-- Pilih Laporan Terverifikasi --</option>';
                verifiedMatches.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m.id;
                    opt.textContent = m.laporan_nama;
                    matchSelect.appendChild(opt);
                });
            }
        } catch (error) {
            matchSelect.innerHTML = '<option value="">-- Gagal memuat data --</option>';
        } finally {
            matchSelect.disabled = false;
        }
    }

    async function loadScheduleList() {
        try {
            scheduleListContainer.style.display = 'none';
            if(scheduleLoadingIndicator) scheduleLoadingIndicator.style.display = 'block';

            const response = await FinderApp.apiFetch('/api/pickup-schedules');
            const schedules = response?.data?.pickup_schedules || [];

            if (schedules.length === 0) {
                scheduleListContainer.innerHTML = '<div class="empty-state soft">Belum ada riwayat jadwal pengambilan.</div>';
            } else {
                scheduleListContainer.innerHTML = '';
                schedules.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'schedule-card';
                    card.innerHTML = `
                        <div class="match-list-main">
                            <div class="match-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                <h3 style="margin: 0; font-weight: 700;">${s.laporan_nama || 'Jadwal Pengambilan'}</h3>
                                <span class="status-badge is-${s.status}" style="flex-shrink: 0; margin-left: 12px;">${FinderApp.formatStatus(s.status)}</span>
                            </div>
                            <p class="text-sm"><strong>Waktu:</strong> ${FinderApp.formatDateTime(s.waktu_jadwal)}</p>
                            <p class="text-sm"><strong>Lokasi:</strong> ${FinderApp.escapeHtml(s.lokasi_pengambilan)}</p>
                            ${s.status === 'menunggu_persetujuan' ? `
                                <button type="button" class="btn btn-sm btn-danger mt-16" onclick="window.cancelSchedule(${s.id})">Batalkan Jadwal</button>
                            ` : ''}
                            ${s.status === 'disetujui' ? `
                                <p class="text-sm mt-16" style="color: var(--primary-color);"><strong>Silahkan datang sesuai jadwal dan lokasi yang telah disetujui.</strong></p>
                            ` : ''}
                        </div>
                    `;
                    scheduleListContainer.appendChild(card);
                });
            }
        } catch (error) {
            scheduleListContainer.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat jadwal.'))}</div>`;
        } finally {
            if(scheduleLoadingIndicator) scheduleLoadingIndicator.style.display = 'none';
            scheduleListContainer.style.display = 'block';
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('btnSubmit');
        const matchId = matchSelect.value;
        const dtStr = scheduleDate.value;
        const tmStr = scheduleTime.value;
        const dt = FinderApp.combineDateTime(dtStr, tmStr);
        const loc = scheduleLocation.value.trim();
        const note = scheduleNote.value.trim();

        if (new Date(dtStr) < new Date(new Date().toDateString())) {
            FinderApp.showToast('Tanggal jadwal tidak boleh di masa lalu.', 'error');
            return;
        }

        if (!matchId || !dt || !loc) {
            FinderApp.showToast('Laporan, tanggal, waktu, dan lokasi wajib diisi.', 'error');
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Memproses...';

        try {
            await FinderApp.apiFetch('/api/pickup-schedules', {
                method: 'POST',
                body: { match_id: matchId, waktu_jadwal: dt, lokasi_pengambilan: loc, catatan: note }
            });
            FinderApp.showToast('Jadwal pengambilan berhasil diajukan.', 'success');
            form.reset();
            loadScheduleList();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal mengajukan jadwal.'), 'error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Ajukan Jadwal';
        }
    });

    window.cancelSchedule = async (id) => {
        if (!confirm('Batalkan pengajuan jadwal ini?')) return;

        try {
            await FinderApp.apiFetch(`/api/pickup-schedules/${id}/cancel`, {
                method: 'PUT'
            });
            FinderApp.showToast('Jadwal berhasil dibatalkan.', 'success');
            loadScheduleList();
        } catch (err) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(err, 'Gagal membatalkan jadwal.'), 'error');
        }
    };

    loadMatchesForSchedule();
    loadScheduleList();
});
