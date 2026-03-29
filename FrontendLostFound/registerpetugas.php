<?php
$pageTitle = 'Register Petugas - Finder by KAI';
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
                <div class="brand-mark">👮‍♂️</div>
                <div>
                    <div class="brand-title">Finder</div>
                    <div class="brand-subtitle">Portal Petugas KAI</div>
                </div>
            </a>
            <span class="eyebrow">Akses Khusus</span>
            <h1>Pendaftaran Akun Petugas & Keamanan Stasiun.</h1>
            <div class="promo-panel">
                <strong>Area Khusus Karyawan</strong>
                <p>Kelola barang temuan, jadwalkan pengambilan, dan pantau seluruh laporan kehilangan penumpang dari satu dashboard modern.</p>
            </div>
        </div>

        <div class="auth-card auth-card-large">
            <div class="auth-card-logo">👮‍♂️</div>
            <h2>Daftar Akun Petugas</h2>
            <p class="muted center">Silakan lengkapi data profil tugas Anda di bawah ini.</p>

            <form id="registerForm" class="form-stack">
                <input type="hidden" id="role" name="role" value="petugas">
                <div class="form-group">
                    <label for="name">Nama Lengkap Petugas</label>
                    <input type="text" id="name" name="name" placeholder="Masukkan nama" required>
                </div>
                <div class="form-group">
                    <label for="regEmail">Email Resmi (KAI)</label>
                    <input type="email" id="regEmail" name="email" placeholder="Masukkan email" required>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label for="regPassword">Password</label>
                        <div class="password-input-wrap">
                            <input type="password" id="regPassword" name="password" placeholder="Minimal 8 karakter" required>
                            <button type="button" class="toggle-password" data-target="regPassword">👁</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="confirmPassword">Konfirmasi Password</label>
                        <div class="password-input-wrap">
                            <input type="password" id="confirmPassword" name="confirm_password" placeholder="Ulangi password" required>
                            <button type="button" class="toggle-password" data-target="confirmPassword">👁</button>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-block">Daftar Sebagai Petugas</button>
            </form>

            <p class="switch-link">Sudah punya akun? <a href="<?= htmlspecialchars(frontend_url('login.php')) ?>">Login Sekarang</a></p>
        </div>
    </section>
</main>
<?php $pageScript = 'assets/js/pages-register.js'; require_once __DIR__ . '/partials/footer.php'; ?>
