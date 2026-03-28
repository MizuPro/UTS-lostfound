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

    let verifiedMatches = [];

    async function loadMatchesForSchedule() {
        try {
            // First get all matches for this user (which implies they are the pelapor)
            const response = await FinderApp.apiFetch('/api/matches');
            const matches = response?.data?.matches || [];

            // Allow scheduling only for diverifikasi
            verifiedMatches = matches.filter(m => m.status === 'diverifikasi');

            if (verifiedMatches.length === 0) {
                matchSelect.innerHTML = '<option value="">-- Tidak ada match yang diverifikasi --</option>';
            } else {
                matchSelect.innerHTML = '<option value="">-- Pilih Laporan --</option>';
                verifiedMatches.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m.id;
                    opt.textContent = `Match #${m.id} - ${m.laporan_nama}`;
                    matchSelect.appendChild(opt);
                });
            }
        } catch (error) {
            matchSelect.innerHTML = '<option value="">-- Gagal memuat data --</option>';
        }
    }

    async function loadScheduleList() {
        try {
            const response = await FinderApp.apiFetch('/api/pickup-schedules');
            const schedules = response?.data?.pickup_schedules || [];

            if (schedules.length === 0) {
                scheduleListContainer.innerHTML = '<div class="empty-state soft">Belum ada jadwal pengambilan.</div>';
                return;
            }

            scheduleListContainer.innerHTML = '';
            schedules.forEach(s => {
                const card = document.createElement('div');
                card.className = 'match-list-item';
                card.innerHTML = `
                    <div class="match-list-main">
                        <div class="match-header">
                            <h3>Jadwal Match #${s.match_id}</h3>
                            <span class="status-badge is-${s.status}">${FinderApp.formatStatus(s.status)}</span>
                        </div>
                        <p class="text-sm"><strong>Waktu:</strong> ${FinderApp.formatDateTime(s.waktu_jadwal)}</p>
                        <p class="text-sm"><strong>Lokasi:</strong> ${FinderApp.escapeHtml(s.lokasi_pengambilan)}</p>
                        ${s.status === 'menunggu_persetujuan' ? `
                            <button type="button" class="btn btn-sm btn-danger mt-16" onclick="window.cancelSchedule(${s.id})">Batalkan Jadwal</button>
                        ` : ''}
                    </div>
                `;
                scheduleListContainer.appendChild(card);
            });
        } catch (error) {
            scheduleListContainer.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat jadwal.'))}</div>`;
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('btnSubmit');
        btn.disabled = true;
        btn.textContent = 'Menyimpan...';

        const matchId = matchSelect.value;
        const dt = FinderApp.combineDateTime(scheduleDate.value, scheduleTime.value);
        const loc = scheduleLocation.value.trim();
        const note = scheduleNote.value.trim();

        if (!matchId || !dt || !loc) {
            FinderApp.showToast('Laporan, tanggal, waktu, dan lokasi wajib diisi.', 'error');
            btn.disabled = false;
            btn.textContent = 'Ajukan Jadwal';
            return;
        }

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
