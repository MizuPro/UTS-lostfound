document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('pelapor');
    if (!user) return;

    const profileInfo = document.getElementById('reportProfileInfo');
    const form = document.getElementById('lostReportForm');
    if (!form) return;

    const namaBarangInput = document.getElementById('lostItemName');
    const jenisInput = document.getElementById('lostItemType');
    const tanggalInput = document.getElementById('lostDate');
    const jamInput = document.getElementById('lostTime');
    const lokasiInput = document.getElementById('lostLocation');
    const deskripsiInput = document.getElementById('lostDescription');

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
            profileInfo.innerHTML = `<div class="helper-box">${FinderApp.escapeHtml(FinderApp.getApiErrorMessage(error, 'Gagal memuat data profil.'))}</div>`;
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';

        const waktuHilang = FinderApp.combineDateTime(tanggalInput.value, jamInput.value);
        if (!waktuHilang) {
            FinderApp.showToast('Tanggal dan jam kehilangan wajib diisi.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            return;
        }

        const namaBarang = namaBarangInput.value.trim();
        const lokasi = lokasiInput.value.trim();
        const detail = deskripsiInput.value.trim();
        const jenis = jenisInput.value.trim();
        const deskripsi = jenis ? `[Jenis: ${jenis}] ${detail}` : detail;

        if (!namaBarang || !lokasi || !detail) {
            FinderApp.showToast('Nama barang, lokasi, dan detail barang wajib diisi.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            return;
        }

        const payload = new FormData();
        payload.append('nama_barang', namaBarang);
        payload.append('lokasi', lokasi);
        payload.append('waktu_hilang', waktuHilang);
        payload.append('deskripsi', deskripsi);

        const photo = document.getElementById('lostPhoto').files[0];
        if (photo) {
            if (photo.size > 5 * 1024 * 1024) {
                FinderApp.showToast('Ukuran foto terlalu besar. Maksimal 5MB.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                return;
            }
            payload.append('foto', photo);
        }

        try {
            await FinderApp.apiFetch('/api/lost-reports', {
                method: 'POST',
                body: payload,
            });

            FinderApp.showToast('Laporan kehilangan berhasil dibuat.', 'success');
            form.reset();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal membuat laporan.'), 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });

    loadProfile();
});
