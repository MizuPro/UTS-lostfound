document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const rememberEl = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            FinderApp.showAlert('Login gagal', 'Email dan password wajib diisi.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';

        try {
            const response = await FinderApp.apiFetch('/api/auth/login', {
                method: 'POST',
                body: { email, password },
            });

            const data = response?.data || {};

            if (!data.token || !data.user) {
                throw new Error('Data login tidak lengkap dari server.');
            }

            FinderApp.persistAuth(data.token, data.user, rememberEl.checked);

            sessionStorage.setItem('finder_flash_message', 'Login berhasil. Selamat datang.');
            window.location.href =
                window.APP_CONFIG.FRONTEND_BASE_URL +
                FinderApp.getHomePathByRole(data.user?.role);

        } catch (error) {
            FinderApp.showAlert(
                'Login gagal',
                FinderApp.getApiErrorMessage(error, 'Email atau password tidak sesuai.'),
                'error'
            );
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});
