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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Memproses...';

        const password = form.password.value;
        const confirmPassword = form.confirm_password.value;
        if (password !== confirmPassword) {
            FinderApp.showToast('Konfirmasi password tidak sama.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
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
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });
});
