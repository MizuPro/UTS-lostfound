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
    const loadingIndicator = document.getElementById('loadingIndicator');

    let currentSchedules = [];

    async function loadSchedules() {
        try {
            matchSelect.disabled = true;

            // 1. Load existing schedules
            const schedResp = await FinderApp.apiFetch('/api/pickup-schedules');
            currentSchedules = schedResp?.data?.pickup_schedules || [];

            // 2. Load verified matches that don't have a schedule yet
            const matchResp = await FinderApp.apiFetch('/api/matches?status=diverifikasi&exclude_scheduled=1');
            const availableMatches = matchResp?.data?.matches || [];

            matchSelect.innerHTML = '<option value="">-- Pilih Pencocokan / Jadwal --</option>';

            // Render existing active schedules
            const pendingOrApproved = currentSchedules.filter(s =>
                s.status === 'menunggu_persetujuan' || s.status === 'disetujui'
            );

            if (pendingOrApproved.length > 0) {
                const group = document.createElement('optgroup');
                group.label = 'Jadwal Aktif / Menunggu';
                pendingOrApproved.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = `schedule:${s.id}`;
                    let dateLabel = s.waktu_jadwal ? ` - ${FinderApp.formatDateTime(s.waktu_jadwal)}` : '';
                    opt.textContent = `[${s.status.toUpperCase()}] Match #${s.match_id} - ${s.pelapor_name}${dateLabel}`;
                    group.appendChild(opt);
                });
                matchSelect.appendChild(group);
            }

            // Render matches waiting for schedule
            if (availableMatches.length > 0) {
                const group = document.createElement('optgroup');
                group.label = 'Pencocokan Siap Dijadwalkan (Baru)';
                availableMatches.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = `match:${m.id}`;
                    opt.textContent = `[SIAP] Match #${m.id} - ${m.pelapor_name} - ${m.laporan_nama}`;
                    group.appendChild(opt);
                });
                matchSelect.appendChild(group);
            }

            if (pendingOrApproved.length === 0 && availableMatches.length === 0) {
                matchSelect.innerHTML = '<option value="">-- Tidak ada data untuk dijadwalkan --</option>';
            }
        } catch (error) {
            FinderApp.showToast('Gagal memuat daftar data.', 'error');
            matchSelect.innerHTML = '<option value="">-- Gagal memuat data --</option>';
        } finally {
            matchSelect.disabled = false;
        }
    }

    matchSelect.addEventListener('change', async (e) => {
        const val = e.target.value;
        if (!val) {
            scheduleDetailCard.style.display = 'none';
            return;
        }

        const [type, id] = val.split(':');
        
        scheduleDetailCard.style.display = 'none';
        loadingIndicator.style.display = 'block';

        try {
            if (type === 'schedule') {
                const response = await FinderApp.apiFetch(`/api/pickup-schedules/${id}`);
                const s = response?.data?.pickup_schedule;
                if (!s) return;

                scheduleIdInput.value = s.id;
                form.dataset.matchId = s.match_id;
                form.dataset.type = 'schedule';

                pelaporName.value = s.pelapor_name || '-';
                pelaporEmail.value = s.pelapor_email || '-';
                laporanBarang.value = s.laporan_nama || '-';

                const dt = s.waktu_jadwal ? s.waktu_jadwal.split(' ') : ['', ''];
                scheduleDate.value = dt[0];
                scheduleTime.value = dt[1] ? dt[1].substring(0, 5) : '';

                scheduleLocation.value = s.lokasi_pengambilan || '';
                scheduleNote.value = s.catatan || '';

                statusBadge.className = `status-badge is-${s.status}`;
                statusBadge.textContent = FinderApp.formatStatus(s.status);

                toggleFormInputs(s.status);
                renderActionButtons(s.status);
            } else {
                // New schedule from match
                const response = await FinderApp.apiFetch(`/api/matches/${id}`);
                const m = response?.data?.match;
                if (!m) return;

                scheduleIdInput.value = '';
                form.dataset.matchId = m.id;
                form.dataset.type = 'new';

                pelaporName.value = m.pelapor_name || '-';
                pelaporEmail.value = m.pelapor_email || '-';
                laporanBarang.value = m.laporan_nama || '-';

                scheduleDate.value = '';
                scheduleTime.value = '';
                scheduleLocation.value = 'Kantor Petugas (Default)';
                scheduleNote.value = '';

                statusBadge.className = 'status-badge is-pending';
                statusBadge.textContent = 'Belum Dijadwalkan';

                toggleFormInputs('new');
                renderActionButtons('new');
            }

            scheduleDetailCard.style.display = 'block';
        } catch (error) {
            FinderApp.showToast('Gagal memuat detail.', 'error');
        } finally {
            loadingIndicator.style.display = 'none';
        }
    });

    function toggleFormInputs(status) {
        const isEditable = status === 'new' || status === 'disetujui';
        scheduleDate.disabled = !isEditable;
        scheduleTime.disabled = !isEditable;
        scheduleLocation.disabled = !isEditable;
        // Catatan selalu bisa diisi
        scheduleNote.disabled = false; 
    }

    function renderActionButtons(status) {
        actionButtons.innerHTML = '';
        if (status === 'new') {
            actionButtons.innerHTML = `
                <button type="button" class="btn btn-primary" onclick="window.createSchedule()">Buat & Setujui Jadwal</button>
            `;
        } else if (status === 'menunggu_persetujuan') {
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

    window.createSchedule = async () => {
        const matchId = form.dataset.matchId;
        const date = scheduleDate.value;
        const time = scheduleTime.value;
        const loc = scheduleLocation.value.trim();
        const note = scheduleNote.value.trim();

        if (new Date(date) < new Date(new Date().toDateString())) {
            FinderApp.showToast('Tanggal jadwal tidak boleh di masa lalu.', 'error');
            return;
        }

        const dt = FinderApp.combineDateTime(date, time);
        if (!dt || !loc) {
            FinderApp.showToast('Tanggal, waktu, dan lokasi wajib diisi.', 'error');
            return;
        }

        try {
            await FinderApp.apiFetch('/api/pickup-schedules', {
                method: 'POST',
                body: { match_id: matchId, waktu_jadwal: dt, lokasi_pengambilan: loc, catatan: note }
            });
            FinderApp.showToast('Jadwal berhasil dibuat dan disetujui.', 'success');
            loadSchedules();
            scheduleDetailCard.style.display = 'none';
        } catch (err) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(err, 'Gagal membuat jadwal.'), 'error');
        }
    };

    window.reviewSchedule = async (action) => {
        const id = scheduleIdInput.value;
        const note = scheduleNote.value.trim();

        if (action === 'ditolak' && !note) {
            FinderApp.showToast('Wajib mengisi catatan alasan penolakan.', 'error');
            scheduleNote.focus();
            return;
        }

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

        if (new Date(date) < new Date(new Date().toDateString())) {
            FinderApp.showToast('Tanggal jadwal tidak boleh di masa lalu.', 'error');
            return;
        }

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
        if (!confirm('Peringatan: Aksi ini menandakan bahwa barang sudah diserahkan kepada pelapor dengan benar!\n\nApakah serah terima barang secara fisik benar-benar sudah selesai? Status laporan akan ditutup setelah ini.')) return;

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
