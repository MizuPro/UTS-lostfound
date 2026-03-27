<?php
$pageTitle = 'Home - Finder by KAI';
$pageClass = 'theme-app';
$activePage = 'home';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar.php';
?>
<main>
    <section class="hero-section">
        <div class="container hero-grid">
            <div>
                <span class="eyebrow">Layanan Lost &amp; Found CommuterLink Nusantara</span>
                <h1>Temukan &amp; Ambil Barang Anda Yang Hilang Dengan Mudah Disini</h1>
                <p class="hero-text">Finder membantu Anda melihat barang temuan, membuat laporan kehilangan, dan memantau prosesnya dalam satu tempat.</p>
                <div class="hero-actions">
                    <a href="<?= htmlspecialchars(frontend_url('found.php')) ?>" class="btn btn-primary">Lihat Barang Temuan</a>
                    <a href="<?= htmlspecialchars(frontend_url('report-lost.php')) ?>" class="btn btn-secondary">Buat Laporan Kehilangan</a>
                </div>
                <div class="hero-metrics">
                    <div class="metric-card">
                        <strong>Aman</strong>
                        <span>Akses akun tersimpan dengan baik</span>
                    </div>
                    <div class="metric-card">
                        <strong>Sesuai kebutuhan</strong>
                        <span>Tampilan menyesuaikan jenis akun</span>
                    </div>
                    <div class="metric-card">
                        <strong>Nyaman digunakan</strong>
                        <span>Tetap rapi di desktop dan mobile</span>
                    </div>
                </div>
            </div>

            <div class="collage-wrap">
                <div class="floating-card card-a">Barang temuan<br>terverifikasi</div>
                <div class="floating-card card-b">Laporan hilang<br>tercatat</div>
                <div class="floating-card card-c">Status laporan<br>dipantau</div>
                <div class="floating-card card-d">Pencarian cepat<br>dan aman</div>
            </div>
        </div>
    </section>

    <section class="section-block">
        <div class="container">
            <div class="section-head">
                <div>
                    <span class="eyebrow">Alur Penggunaan</span>
                    <h2>Cara menggunakan Finder</h2>
                </div>
            </div>
            <div class="steps-grid">
                <article class="info-card">
                    <span class="step-number">01</span>
                    <h3>Daftar / Login</h3>
                    <p>Pengguna membuat akun atau masuk menggunakan akun yang sudah terdaftar. Role akan dibaca otomatis dari backend.</p>
                </article>
                <article class="info-card">
                    <span class="step-number">02</span>
                    <h3>Lihat Found Items</h3>
                    <p>Pelapor dapat melihat daftar barang temuan dengan data publik yang aman untuk menghindari klaim palsu.</p>
                </article>
                <article class="info-card">
                    <span class="step-number">03</span>
                    <h3>Buat Report Lost</h3>
                    <p>Laporan kehilangan dikirim ke endpoint backend asli tanpa mengubah skema database atau kontrak API.</p>
                </article>
                <article class="info-card">
                    <span class="step-number">04</span>
                    <h3>Pantau Status</h3>
                    <p>Status laporan dapat dipantau dari halaman profile sesuai status yang dikembalikan oleh backend.</p>
                </article>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/footer.php'; ?>
