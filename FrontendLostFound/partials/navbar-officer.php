<?php
require_once __DIR__ . '/../includes/url.php';
$activePage = $activePage ?? '';
?>
<header class="site-header">
    <div class="container nav-shell officer-nav-shell">
        <a class="brand" href="<?= htmlspecialchars(frontend_url('officer-home.php')) ?>">
            <div class="brand-mark">🔎</div>
            <div>
                <div class="brand-title">Finder</div>
                <div class="brand-subtitle">by KAI</div>
            </div>
        </a>

        <button class="mobile-nav-toggle" id="mobileNavToggle" type="button" aria-label="Toggle navigation">☰</button>

        <nav class="main-nav officer-nav" id="mainNav">
            <a href="<?= htmlspecialchars(frontend_url('officer-home.php')) ?>" class="<?= $activePage === 'officer-home' ? 'is-active' : '' ?>">Beranda</a>

            <div class="nav-group <?= in_array($activePage, ['officer-report-lost', 'officer-report-found'], true) ? 'is-active' : '' ?>">
                <button type="button" class="nav-group-toggle">Input Data</button>
                <div class="nav-dropdown">
                    <a href="<?= htmlspecialchars(frontend_url('officer-report-lost.php')) ?>">Input Laporan Hilang</a>
                    <a href="<?= htmlspecialchars(frontend_url('officer-report-found.php')) ?>">Input Barang Temuan</a>
                </div>
            </div>

            <div class="nav-group <?= in_array($activePage, ['officer-list-lost', 'officer-list-found', 'officer-match'], true) ? 'is-active' : '' ?>">
                <button type="button" class="nav-group-toggle">Kelola Data</button>
                <div class="nav-dropdown">
                    <a href="<?= htmlspecialchars(frontend_url('officer-list-lost.php')) ?>">Daftar Laporan Hilang</a>
                    <a href="<?= htmlspecialchars(frontend_url('officer-list-found.php')) ?>">Daftar Barang Temuan</a>
                    <a href="<?= htmlspecialchars(frontend_url('officer-match.php')) ?>">Pencocokan</a>
                </div>
            </div>

            <div class="nav-group <?= in_array($activePage, ['officer-reservation', 'officer-reservation-list'], true) ? 'is-active' : '' ?>">
                <button type="button" class="nav-group-toggle">Pengambilan</button>
                <div class="nav-dropdown">
                    <a href="<?= htmlspecialchars(frontend_url('officer-reservation.php')) ?>">Buat Jadwal Ambil</a>
                    <a href="<?= htmlspecialchars(frontend_url('officer-reservation-list.php')) ?>">Daftar Jadwal Ambil</a>
                </div>
            </div>
        </nav>

        <div class="nav-user" id="navUserArea">
            <a href="<?= htmlspecialchars(frontend_url('login.php')) ?>" class="btn btn-outline" id="navLoginBtn">Masuk</a>
        </div>
    </div>
</header>