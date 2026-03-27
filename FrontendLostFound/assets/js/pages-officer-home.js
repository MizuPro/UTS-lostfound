document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const summary = document.getElementById('officerSummaryCards');
    const recentLost = document.getElementById('officerRecentLost');
    const recentFound = document.getElementById('officerRecentFound');

    function renderList(target, items, type) {
        if (!items.length) {
            target.innerHTML = '<div class="helper-box">Belum ada data.</div>';
            return;
        }
        target.innerHTML = items.map((item) => {
            if (type === 'lost') {
                return `
                    <article class="stack-card">
                        <div>
                            <strong>${FinderApp.escapeHtml(item.nama_barang)}</strong>
                            <p>${FinderApp.escapeHtml(item.pelapor_name || '-')} • ${FinderApp.escapeHtml(item.pelapor_email || '-')}</p>
                        </div>
                        <div>${FinderApp.statusBadge(item.status)}</div>
                    </article>
                `;
            }
            return `
                <article class="stack-card">
                    <div>
                        <strong>${FinderApp.escapeHtml(item.nama_barang)}</strong>
                        <p>${FinderApp.escapeHtml(item.lokasi || '-')}</p>
                    </div>
                    <div>${FinderApp.statusBadge(item.status)}</div>
                </article>
            `;
        }).join('');
    }

    async function loadDashboard() {
        try {
            const [lostRes, foundRes, ongoingRes, matchesRes] = await Promise.all([
                FinderApp.apiFetch('/api/lost-reports'),
                FinderApp.apiFetch('/api/found-items'),
                FinderApp.apiFetch('/api/found-items/ongoing'),
                FinderApp.apiFetch('/api/matches'),
            ]);

            const lost = lostRes?.data?.lost_reports || [];
            const found = foundRes?.data?.found_items || [];
            const ongoing = ongoingRes?.data?.found_items || [];
            const matches = matchesRes?.data?.matches || [];
            const today = new Date().toISOString().slice(0, 10);
            const selesaiHariIni = matches.filter((item) => String(item.updated_at || '').slice(0, 10) === today && item.status === 'selesai').length;

            summary.innerHTML = `
                <article class="metric-card"><strong>${ongoing.length}</strong><span>Barang ongoing</span></article>
                <article class="metric-card"><strong>${lost.length}</strong><span>Laporan masuk</span></article>
                <article class="metric-card"><strong>${matches.filter((item) => item.status === 'pending').length}</strong><span>Pending match</span></article>
                <article class="metric-card"><strong>${selesaiHariIni}</strong><span>Selesai hari ini</span></article>
            `;

            renderList(recentLost, lost.slice(0, 5), 'lost');
            renderList(recentFound, found.slice(0, 5), 'found');
        } catch (error) {
            summary.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat dashboard.'))}</div>`;
            recentLost.innerHTML = '<div class="helper-box">Gagal memuat data.</div>';
            recentFound.innerHTML = '<div class="helper-box">Gagal memuat data.</div>';
        }
    }

    loadDashboard();
});
