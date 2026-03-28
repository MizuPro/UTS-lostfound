document.addEventListener('DOMContentLoaded', () => {
    const user = FinderApp.requireAuth('petugas');
    if (!user) return;

    const profileInfo = document.getElementById('officerFoundProfileInfo');
    const form = document.getElementById('foundItemForm');
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

        const waktuTemuan = FinderApp.combineDateTime(
            document.getElementById('foundDate').value,
            document.getElementById('foundTime').value
        );
        if (!waktuTemuan) {
            FinderApp.showToast('Tanggal dan jam temuan wajib diisi.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            return;
        }

        const payload = new FormData();
        payload.append('nama_barang', document.getElementById('foundItemName').value.trim());
        payload.append('lokasi', document.getElementById('foundLocation').value.trim());
        payload.append('waktu_temuan', waktuTemuan);
        payload.append('deskripsi', document.getElementById('foundDescription').value.trim());

        const photo = document.getElementById('foundPhoto').files[0];
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
            await FinderApp.apiFetch('/api/found-items', {
                method: 'POST',
                body: payload,
            });
            FinderApp.showToast('Barang temuan berhasil ditambahkan.', 'success');
            form.reset();
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Gagal menambahkan barang temuan.'), 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });

    loadProfile();
});
