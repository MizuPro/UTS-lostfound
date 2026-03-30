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

    function renderStatusBadge(status) {
        const map = {
            menunggu_persetujuan: { label: 'Menunggu Persetujuan', color: '#b86f00', bg: 'rgba(190,120,0,0.10)' },
            disetujui:            { label: 'Disetujui',            color: '#19703b', bg: 'rgba(34,147,73,0.12)' },
            ditolak:              { label: 'Ditolak',              color: '#b11818', bg: 'rgba(206,44,44,0.10)' },
            dibatalkan:           { label: 'Dibatalkan',           color: '#555',    bg: 'rgba(17,17,17,0.07)' },
            selesai:              { label: 'Selesai',              color: '#244cff', bg: 'rgba(36,96,255,0.10)' },
        };
        const s = map[status] || { label: FinderApp.formatStatus(status), color: '#111', bg: 'rgba(17,17,17,0.07)' };
        return `<span style="display:inline-flex;align-items:center;padding:6px 14px;border-radius:999px;font-size:13px;font-weight:700;color:${s.color};background:${s.bg}">${s.label}</span>`;
    }

    async function loadScheduleList() {
        try {
            scheduleListContainer.style.display = 'none';
            if (scheduleLoadingIndicator) scheduleLoadingIndicator.style.display = 'block';

            const response = await FinderApp.apiFetch('/api/pickup-schedules');
            const schedules = response?.data?.pickup_schedules || [];

            if (schedules.length === 0) {
                scheduleListContainer.innerHTML = '<div class="empty-state soft">Belum ada riwayat jadwal pengambilan.</div>';
            } else {
                scheduleListContainer.innerHTML = '';
                schedules.forEach(s => {
                    const card = document.createElement('div');
                    card.className = 'schedule-card';

                    const canCancel  = s.status === 'menunggu_persetujuan' || s.status === 'disetujui';
                    const canRevise  = s.status === 'disetujui';

                    card.innerHTML = `
                        <div class="match-list-main">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 12px; flex-wrap: wrap;">
                                <h3 style="margin: 0; font-weight: 700;">${FinderApp.escapeHtml(s.laporan_nama || 'Jadwal Pengambilan')}</h3>
                                ${renderStatusBadge(s.status)}
                            </div>
                            <p style="margin: 6px 0; font-size: 14px;"><strong>Waktu:</strong> ${FinderApp.formatDateTime(s.waktu_jadwal)}</p>
                            <p style="margin: 6px 0; font-size: 14px;"><strong>Lokasi:</strong> ${FinderApp.escapeHtml(s.lokasi_pengambilan)}</p>
                            ${s.catatan ? `<p style="margin: 6px 0; font-size: 13px; color: var(--text-soft);"><strong>Catatan:</strong> ${FinderApp.escapeHtml(s.catatan)}</p>` : ''}

                            ${s.status === 'disetujui' ? `
                                <div style="margin-top: 14px; padding: 12px 16px; background: rgba(34,147,73,0.08); border-radius: 12px; color: #19703b; font-size: 14px; font-weight: 600;">
                                    ✅ Jadwal telah disetujui. Silakan datang sesuai jadwal dan lokasi yang tertera.
                                </div>
                            ` : ''}

                            ${s.status === 'ditolak' ? `
                                <div style="margin-top: 14px; padding: 12px 16px; background: rgba(206,44,44,0.08); border-radius: 12px; color: #b11818; font-size: 14px;">
                                    ❌ Jadwal ditolak oleh petugas. Anda dapat membuat jadwal baru.
                                </div>
                            ` : ''}

                            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px;">
                                ${canRevise ? `
                                    <button type="button" class="btn btn-secondary btn-sm" onclick="window.openReviseModal(${s.id}, '${FinderApp.escapeHtml(s.waktu_jadwal)}', '${FinderApp.escapeHtml(s.lokasi_pengambilan)}', '${FinderApp.escapeHtml(s.catatan || '')}')">Ajukan Revisi Jadwal</button>
                                ` : ''}
                                ${canCancel ? `
                                    <button type="button" class="btn btn-outline" style="color: #b11818; border-color: rgba(177,24,24,0.24);" onclick="window.cancelSchedule(${s.id})">Batalkan Jadwal</button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                    scheduleListContainer.appendChild(card);
                });
            }
        } catch (error) {
            scheduleListContainer.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat jadwal.'))}</div>`;
        } finally {
            if (scheduleLoadingIndicator) scheduleLoadingIndicator.style.display = 'none';
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

    // ── Cancel ───────────────────────────────────────────────────────────────
    window.cancelSchedule = async (id) => {
        if (!confirm('Batalkan jadwal ini? Anda dapat membuat jadwal baru setelahnya.')) return;

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

    // ── Revise modal logic ────────────────────────────────────────────────────
    window.openReviseModal = (id, waktu, lokasi, catatan) => {
        document.getElementById('reviseScheduleId').value = id;

        // Pre-fill date and time
        const { date, time } = FinderApp.splitDateTime(waktu);
        document.getElementById('reviseDateInput').value = date;
        document.getElementById('reviseTimeInput').value = time;
        document.getElementById('reviseLocationInput').value = lokasi;
        document.getElementById('reviseNoteInput').value = catatan;

        FinderApp.openModal('reviseScheduleModal');
    };

    const reviseForm = document.getElementById('reviseScheduleForm');
    if (reviseForm) {
        reviseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.currentTarget.querySelector('button[type="submit"]');
            const id = document.getElementById('reviseScheduleId').value;
            const date = document.getElementById('reviseDateInput').value;
            const time = document.getElementById('reviseTimeInput').value;
            const loc  = document.getElementById('reviseLocationInput').value.trim();
            const note = document.getElementById('reviseNoteInput').value.trim();
            const waktu = FinderApp.combineDateTime(date, time);

            if (!date || !time || !loc) {
                FinderApp.showToast('Tanggal, waktu, dan lokasi wajib diisi.', 'error');
                return;
            }

            if (new Date(date) < new Date(new Date().toDateString())) {
                FinderApp.showToast('Tanggal tidak boleh di masa lalu.', 'error');
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Mengajukan...';

            try {
                await FinderApp.apiFetch(`/api/pickup-schedules/${id}/revise`, {
                    method: 'PUT',
                    body: { waktu_jadwal: waktu, lokasi_pengambilan: loc, catatan: note }
                });
                FinderApp.showToast('Permintaan revisi berhasil diajukan. Menunggu persetujuan petugas.', 'success');
                FinderApp.closeModal(document.getElementById('reviseScheduleModal'));
                loadScheduleList();
            } catch (err) {
                FinderApp.showToast(FinderApp.getApiErrorMessage(err, 'Gagal mengajukan revisi.'), 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Kirim Permohonan Revisi';
            }
        });
    }

    loadMatchesForSchedule();
    loadScheduleList();
});
