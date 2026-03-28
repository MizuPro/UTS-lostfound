<?php
$pageTitle = 'Register - Finder by KAI';
$pageClass = 'theme-auth';
$activePage = '';
$isAuthPage = true;
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/includes/url.php';
?>
<main class="auth-page-wrap">
    <section class="auth-layout container auth-layout-wide">
        <div class="auth-promo with-panel">
            <a class="brand auth-brand" href="<?= htmlspecialchars(frontend_url('index.php')) ?>">
                <div class="brand-mark">🔎</div>
                <div>
                    <div class="brand-title">Finder</div>
                    <div class="brand-subtitle">by KAI</div>
                </div>
            </a>
            <span class="eyebrow">Sign Up</span>
            <h1>Buat akun baru untuk mulai menggunakan Finder.</h1>
            <div class="promo-panel">
                <strong>Pendaftaran dibuat sederhana</strong>
                <p>Cukup isi nama, email, password, lalu pilih jenis akun yang sesuai.</p>
            </div>
        </div>

        <div class="auth-card auth-card-large">
            <div class="auth-card-logo">🔎</div>
            <h2>Daftar Akun</h2>
            <p class="muted center">Pilih jenis akun yang sesuai sebelum melanjutkan.</p>

            <div class="role-switch" id="registerRoleSwitch">
                <button type="button" class="role-pill is-active" data-role="pelapor">User / Pelapor</button>
                <button type="button" class="role-pill" data-role="petugas">Petugas</button>
            </div>

            <div class="role-helper" id="roleHelperText">Cocok untuk penumpang yang ingin melaporkan barang hilang dan memantau prosesnya.</div>

            <form id="registerForm" class="form-stack">
                <input type="hidden" id="role" name="role" value="pelapor">
                <div class="form-group">
                    <label for="name">Nama</label>
                    <input type="text" id="name" name="name" placeholder="Masukkan nama" required>
                </div>
                <div class="form-group">
                    <label for="regEmail">Email</label>
                    <input type="email" id="regEmail" name="email" placeholder="Masukkan email" required>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label for="regPassword">Password</label>
                        <div class="password-wrap">
                            <input type="password" id="regPassword" name="password" placeholder="Minimal 8 karakter" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('regPassword', this)">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Konfirmasi Password</label>
                        <div class="password-wrap">
                            <input type="password" id="confirmPassword" name="confirm_password" placeholder="Ulangi password" required>
                            <button type="button" class="password-toggle" onclick="togglePassword('confirmPassword', this)">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Submit</button>
            </form>

            <p class="switch-link">Sudah punya akun? <a href="<?= htmlspecialchars(frontend_url('login.php')) ?>">Login</a></p>
        </div>
    </section>
</main>
<script>
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    }
}
</script>
<?php $pageScript = 'assets/js/pages-register.js'; require_once __DIR__ . '/partials/footer.php'; ?>
