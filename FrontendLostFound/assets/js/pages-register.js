document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const roleInput = document.getElementById('role');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirm_password.value;
        const role = roleInput ? roleInput.value : 'pelapor';

        if (!name || !email || !password || !confirmPassword) {
            FinderApp.showAlert('Registrasi gagal', 'Semua field wajib diisi.', 'error');
            return;
        }

        if (password.length < 8) {
            FinderApp.showAlert('Registrasi gagal', 'Password minimal 8 karakter.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            FinderApp.showAlert('Registrasi gagal', 'Konfirmasi password tidak sama.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';

        try {
            await FinderApp.apiFetch('/api/auth/register', {
                method: 'POST',
                body: {
                    name,
                    email,
                    password,
                    role,
                },
            });

            sessionStorage.setItem('finder_flash_message', 'Registrasi berhasil. Silakan login.');
            window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + '/login.php';
        } catch (error) {
            FinderApp.showAlert(
                'Registrasi gagal',
                FinderApp.getApiErrorMessage(error, 'Registrasi gagal. Silakan coba lagi.'),
                'error'
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
