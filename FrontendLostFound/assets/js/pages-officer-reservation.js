document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const matchSelect = document.getElementById('matchSelect');
    const scheduleDetailCard = document.getElementById('scheduleDetailCard');
    const form = document.getElementById('reservationForm');

    const scheduleIdInput = document.getElementById('scheduleId');
    const pelaporName = document.getElementById('pelaporName');
    const pelaporEmail = document.getElementById('pelaporEmail');
    const laporanBarang = document.getElementById('laporanBarang');

    const scheduleDate = document.getElementById('scheduleDate');
    const scheduleTime = document.getElementById('scheduleTime');
    const scheduleLocation = document.getElementById('scheduleLocation');
    const scheduleNote = document.getElementById('scheduleNote');
    const statusBadge = document.getElementById('scheduleStatusBadge');
    const actionButtons = document.getElementById('actionButtons');

    let currentSchedules = [];

    async function loadSchedules() {
        try {
            const response = await FinderApp.apiFetch('/api/pickup-schedules');
            currentSchedules = response?.data?.schedules || [];

            // Only show active or waiting schedules for review
            const pendingOrApproved = currentSchedules.filter(s =>
                s.status === 'menunggu_persetujuan' || s.status === 'disetujui'
            );

            if (pendingOrApproved.length === 0) {
                matchSelect.innerHTML = '<option value="">-- Tidak ada pengajuan jadwal aktif --</option>';
            } else {
                matchSelect.innerHTML = '<option value="">-- Pilih Jadwal Pengambilan --</option>';
                pendingOrApproved.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.id;
                    opt.textContent = `[${s.status.toUpperCase()}] Match #${s.match_id} - ${s.pelapor_name} - ${FinderApp.formatDateTime(s.waktu_jadwal)}`;
                    matchSelect.appendChild(opt);
                });
            }
        } catch (error) {
            FinderApp.showToast('Gagal memuat daftar jadwal.', 'error');
            matchSelect.innerHTML = '<option value="">-- Gagal memuat data --</option>';
        }
    }

    matchSelect.addEventListener('change', async (e) => {
        const id = e.target.value;
        if (!id) {
            scheduleDetailCard.style.display = 'none';
            return;
        }

        try {
            const response = await FinderApp.apiFetch(`/api/pickup-schedules/${id}`);
            const s = response?.data?.schedule;
            if (!s) return;

            scheduleIdInput.value = s.id;
            pelaporName.value = s.pelapor_name || '-';
            pelaporEmail.value = s.pelapor_email || '-';

            // We need match detail for item name
            const matchResp = await FinderApp.apiFetch(`/api/matches/${s.match_id}`);
            const match = matchResp?.data?.match;
            if (match) {
                laporanBarang.value = match.laporan_nama_barang || '-';
            } else {
                laporanBarang.value = '-';
            }

            const dt = s.waktu_jadwal ? s.waktu_jadwal.split(' ') : ['',''];
            scheduleDate.value = dt[0];
            scheduleTime.value = dt[1] ? dt[1].substring(0, 5) : '';

            scheduleLocation.value = s.lokasi_pengambilan || '';
            scheduleNote.value = s.catatan || '';

            statusBadge.className = `status-badge is-${s.status}`;
            statusBadge.textContent = FinderApp.formatStatus(s.status);

            renderActionButtons(s.status);

            scheduleDetailCard.style.display = 'block';
        } catch (error) {
            FinderApp.showToast('Gagal memuat detail jadwal.', 'error');
        }
    });

    function renderActionButtons(status) {
        actionButtons.innerHTML = '';
        if (status === 'menunggu_persetujuan') {
            actionButtons.innerHTML = `
                <button type="button" class="btn btn-primary" onclick="window.reviewSchedule('disetujui')">Setujui Jadwal</button>
                <button type="button" class="btn btn-danger" onclick="window.reviewSchedule('ditolak')">Tolak</button>
            `;
        } else if (status === 'disetujui') {
            actionButtons.innerHTML = `
                <button type="button" class="btn btn-outline" onclick="window.reschedule()">Ubah Jadwal</button>
                <button type="button" class="btn btn-success" onclick="window.completePickup()">Selesaikan Serah Terima</button>
            `;
        }
    }

    window.reviewSchedule = async (action) => {
        const id = scheduleIdInput.value;
        const note = scheduleNote.value.trim();

        try {
            await FinderApp.apiFetch(`/api/pickup-schedules/${id}/review`, {
                method: 'PUT',
                body: { action: action, catatan: note }
            });
            FinderApp.showToast(`Jadwal berhasil di-${action}.`, 'success');
            loadSchedules();
            scheduleDetailCard.style.display = 'none';
        } catch (err) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(err, 'Gagal memproses.'), 'error');
        }
    };

    window.reschedule = async () => {
        const id = scheduleIdInput.value;
        const date = scheduleDate.value;
        const time = scheduleTime.value;
        const loc = scheduleLocation.value.trim();
        const note = scheduleNote.value.trim();

        const dt = FinderApp.combineDateTime(date, time);
        if (!dt || !loc) {
            FinderApp.showToast('Tanggal, waktu, dan lokasi wajib diisi.', 'error');
            return;
        }

        try {
            await FinderApp.apiFetch(`/api/pickup-schedules/${id}/reschedule`, {
                method: 'PUT',
                body: { waktu_jadwal: dt, lokasi_pengambilan: loc, catatan: note }
            });
            FinderApp.showToast(`Jadwal berhasil diubah.`, 'success');
            loadSchedules();
            scheduleDetailCard.style.display = 'none';
        } catch (err) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(err, 'Gagal mengubah jadwal.'), 'error');
        }
    };

    window.completePickup = async () => {
        if (!confirm('Apakah serah terima barang sudah selesai? Aksi ini akan menyelesaikan laporan dan match terkait.')) return;

        const id = scheduleIdInput.value;
        const note = scheduleNote.value.trim();

        try {
            await FinderApp.apiFetch(`/api/pickup-schedules/${id}/complete`, {
                method: 'PUT',
                body: { catatan: note }
            });
            FinderApp.showToast(`Pengambilan barang selesai!`, 'success');
            loadSchedules();
            scheduleDetailCard.style.display = 'none';
        } catch (err) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(err, 'Gagal menyelesaikan serah terima.'), 'error');
        }
    };

    loadSchedules();
});
