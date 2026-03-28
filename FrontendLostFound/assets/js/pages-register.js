document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const roleInput = document.getElementById('role');
    const roleHelper = document.getElementById('roleHelperText');
    const pills = document.querySelectorAll('.role-pill');

    const roleDescriptions = {
        pelapor: 'Cocok untuk penumpang yang ingin melaporkan barang hilang dan memantau prosesnya.',
        petugas: 'Cocok untuk petugas yang mencatat barang temuan dan menangani proses pencocokan.',
    };

    pills.forEach((pill) => {
        pill.addEventListener('click', () => {
            pills.forEach((item) => item.classList.remove('is-active'));
            pill.classList.add('is-active');
            const role = pill.dataset.role;
            roleInput.value = role;
            roleHelper.textContent = roleDescriptions[role] || '';
        });
    });

    if (!form) return;

    // Inline validation
    ['name', 'email', 'password', 'confirm_password'].forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if(input) {
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
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');

        const password = form.password.value;
        const confirmPassword = form.confirm_password.value;
        if (password !== confirmPassword) {
            FinderApp.showToast('Konfirmasi password tidak sama.', 'error');
            submitBtn.classList.remove('loading');
            return;
        }

        try {
            await FinderApp.apiFetch('/api/auth/register', {
                method: 'POST',
                body: {
                    name: form.name.value.trim(),
                    email: form.email.value.trim(),
                    password,
                    role: roleInput.value,
                },
            });

            sessionStorage.setItem('finder_flash_message', 'Registrasi berhasil. Silakan login.');
            window.location.href = window.APP_CONFIG.FRONTEND_BASE_URL + '/login.php';
        } catch (error) {
            FinderApp.showToast(error.message || 'Registrasi gagal.', 'error');
            submitBtn.classList.remove('loading');
        }
    });
});
