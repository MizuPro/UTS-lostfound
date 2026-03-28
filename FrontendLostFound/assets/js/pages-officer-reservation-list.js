document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const tbody = document.getElementById('schedulesTableBody');

    async function loadSchedules() {
        try {
            const response = await FinderApp.apiFetch('/api/pickup-schedules');
            const schedules = response?.data?.pickup_schedules || [];

            if (schedules.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center soft">Belum ada jadwal pengambilan.</td></tr>';
                return;
            }

            tbody.innerHTML = '';
            schedules.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>#${s.match_id}</strong></td>
                    <td>${FinderApp.escapeHtml(s.pelapor_name || '-')}</td>
                    <td>${FinderApp.formatDateTime(s.waktu_jadwal)}</td>
                    <td>${FinderApp.escapeHtml(s.lokasi_pengambilan)}</td>
                    <td><span class="status-badge is-${s.status}">${FinderApp.formatStatus(s.status)}</span></td>
                    <td>
                        <a href="officer-reservation.php?match_id=${s.match_id}" class="btn btn-sm btn-outline">Detail</a>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat jadwal.'))}</td></tr>`;
        }
    }

    loadSchedules();
});
