document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const rememberEl = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';

        const payload = {
            email: emailInput.value.trim(),
            password: passwordInput.value,
        };

        try {
            const response = await FinderApp.apiFetch('/api/auth/login', {
                method: 'POST',
                body: payload,
            });

            const data = response?.data || {};
            FinderApp.persistAuth(data.token, data.user, rememberEl.checked);
            FinderApp.showToast('Login berhasil.', 'success');
            window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + FinderApp.getHomePathByRole(data.user?.role);
        } catch (error) {
            FinderApp.showToast(FinderApp.getApiErrorMessage(error, 'Login gagal.'), 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });
});
