<?php
$pageTitle = 'Login - Finder by KAI';
$pageClass = 'theme-auth';
$activePage = '';
$isAuthPage = true;
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/includes/url.php';
?>
<main class="auth-page-wrap">
    <section class="auth-layout container auth-layout-single">
        <div class="auth-promo">
            <a class="brand auth-brand" href="<?= htmlspecialchars(frontend_url('index.php')) ?>">
                <div class="brand-mark">🔎</div>
                <div>
                    <div class="brand-title">Finder</div>
                    <div class="brand-subtitle">by KAI</div>
                </div>
            </a>
            <span class="eyebrow">Sign In</span>
            <h1>Masuk untuk melihat barang temuan dan memantau laporan Anda.</h1>
            <p>Setelah masuk, Anda akan diarahkan ke halaman yang sesuai dengan akun Anda.</p>
            <div class="feature-box">
                <strong>Masuk cepat dan aman</strong>
                <span>Gunakan email dan password yang sudah terdaftar</span>
            </div>
        </div>

        <div class="auth-card">
            <div class="auth-card-logo">🔎</div>
            <h2>Login Akun</h2>
            <p class="muted center">Silakan isi data akun Anda.</p>

            <form id="loginForm" class="form-stack">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="Masukkan email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="password-wrap">
                        <input type="password" id="password" name="password" placeholder="Masukkan password" required>
                        <button type="button" class="password-toggle" onclick="togglePassword('password', this)">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="inline-row between">
                    <label class="check-label">
                        <input type="checkbox" id="rememberMe"> Remember me
                    </label>
                    <span class="helper-text">Lupa password belum tersedia saat ini</span>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Submit</button>
            </form>

            <p class="switch-link">Belum punya akun? <a href="<?= htmlspecialchars(frontend_url('register.php')) ?>">Sign Up</a></p>
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
<?php $pageScript = 'assets/js/pages-login.js'; require_once __DIR__ . '/partials/footer.php'; ?>
