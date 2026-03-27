<?php
$pageTitle = 'Dashboard Petugas - Finder by KAI';
$pageClass = 'theme-app';
$activePage = 'officer-home';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="hero-section officer-hero">
        <div class="container hero-grid officer-hero-grid">
            <div>
            <span class="eyebrow">Dashboard Petugas</span>
            <h1>Semua kebutuhan petugas dalam satu dashboard</h1>
            <p class="hero-text">Catat barang temuan, cek laporan masuk, dan lanjutkan proses pencocokan dengan lebih cepat.</p>
                <div class="hero-actions">
                    <a href="<?= htmlspecialchars(frontend_url('officer-report-found.php')) ?>" class="btn btn-primary">Catat barang temuan</a>
                    <a href="<?= htmlspecialchars(frontend_url('officer-match.php')) ?>" class="btn btn-secondary">Buka panel pencocokan</a>
                </div>
            </div>

            <div class="officer-summary-grid" id="officerSummaryCards">
                <article class="metric-card"><strong>Barang Ongoing</strong><span>Memuat...</span></article>
                <article class="metric-card"><strong>Laporan Masuk</strong><span>Memuat...</span></article>
                <article class="metric-card"><strong>Pending Match</strong><span>Memuat...</span></article>
                <article class="metric-card"><strong>Selesai Hari Ini</strong><span>Memuat...</span></article>
            </div>
        </div>
    </section>

    <section class="section-block">
        <div class="container dashboard-two-col">
            <div class="panel-card">
                <div class="inline-row between wrap-gap">
                    <div>
                        <span class="eyebrow">Laporan terbaru</span>
                    </div>
                    <a href="<?= htmlspecialchars(frontend_url('officer-list-lost.php')) ?>" class="btn btn-outline">Lihat semua</a>
                </div>
                <div id="officerRecentLost" class="stack-list mt-16"></div>
            </div>

            <div class="panel-card">
                <div class="inline-row between wrap-gap">
                    <div>
                        <span class="eyebrow">Barang terbaru</span>
                    </div>
                    <a href="<?= htmlspecialchars(frontend_url('officer-list-found.php')) ?>" class="btn btn-outline">Lihat semua</a>
                </div>
                <div id="officerRecentFound" class="stack-list mt-16"></div>
            </div>
        </div>
    </section>

    <section class="section-block no-top">
        <div class="container quick-grid-3">
            <article class="info-card">
                <span class="step-number">01</span>
                <h3>Catat barang temuan</h3>
                <p>Petugas dapat mencatat barang temuan lengkap dengan lokasi, deskripsi, waktu temuan, dan foto jika tersedia.</p>
            </article>
            <article class="info-card">
                <span class="step-number">02</span>
                <h3>Kelola Laporan</h3>
                <p>Semua laporan kehilangan dari pelapor dapat dilihat, diperbarui, ditutup, atau dihapus jika tidak memiliki pencocokan aktif.</p>
            </article>
            <article class="info-card">
                <span class="step-number">03</span>
                <h3>Cocokkan dan serahkan</h3>
                <p>Petugas memilih pasangan laporan dan barang yang paling cocok, memverifikasi, lalu mencatat penyerahan secara digital.</p>
            </article>
        </div>
    </section>
</main>
<?php $pageScript = 'assets/js/pages-officer-home.js'; require_once __DIR__ . '/partials/footer.php'; ?>
