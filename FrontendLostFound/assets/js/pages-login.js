document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const rememberEl = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!form) return;

    // Inline validation
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.form-group');
            if (input.value.trim() !== '') {
                group.classList.add('has-success');
                group.classList.remove('has-error');
            } else {
                group.classList.add('has-error');
                group.classList.remove('has-success');
            }
        });
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');

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
            submitBtn.classList.remove('loading');
        }
    });
});
