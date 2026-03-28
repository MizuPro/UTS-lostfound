document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const profileInfo = document.getElementById('officerLostProfileInfo');
    const form = document.getElementById('officerLostReportForm');
    if (!form) return;

    async function loadProfile() {
        try {
            const response = await FinderApp.apiFetch('/api/auth/me');
            const me = response?.data?.user || user;
            profileInfo.innerHTML = `
                <div class="profile-info-item"><strong>Nama</strong><span>${FinderApp.escapeHtml(me.name || '-')}</span></div>
                <div class="profile-info-item"><strong>Email</strong><span>${FinderApp.escapeHtml(me.email || '-')}</span></div>
                <div class="profile-info-item"><strong>Role</strong><span>${FinderApp.escapeHtml(me.role || '-')}</span></div>
            `;
        } catch (error) {
            profileInfo.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat profil.'))}</div>`;
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';

        const waktuHilang = FinderApp.combineDateTime(
            document.getElementById('officerLostDate').value,
            document.getElementById('officerLostTime').value
        );
        if (!waktuHilang) {
            FinderApp.showToast('Tanggal dan jam kehilangan wajib diisi.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            return;
        }

        const jenis = document.getElementById('officerLostItemType').value.trim();
        const detail = document.getElementById('officerLostDescription').value.trim();
        const deskripsi = jenis ? `[Jenis: ${jenis}] ${detail}` : detail;

        try {
            await FinderApp.apiFetch('/api/lost-reports', {
                method: 'POST',
                body: {
                    nama_barang: document.getElementById('officerLostItemName').value.trim(),
                    lokasi: document.getElementById('officerLostLocation').value.trim(),
                    waktu_hilang: waktuHilang,
                    deskripsi,
                },
            });
            alert('Sukses: Laporan kehilangan berhasil dibuat oleh Petugas.');
            FinderApp.showToast('Laporan kehilangan berhasil dibuat.', 'success');
            form.reset();
        } catch (error) {
            alert('Gagal: ' + FinderApp.getApiErrorMessage(error, 'Gagal membuat laporan kehilangan.'));
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal membuat laporan kehilangan.'), 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });

    loadProfile();
});
