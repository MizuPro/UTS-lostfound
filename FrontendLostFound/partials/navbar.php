<?php
require_once __DIR__ . '/../includes/url.php';
$activePage = $activePage ?? '';
?>
<header class="site-header">
    <div class="container nav-shell">
        <a class="brand" href="<?= htmlspecialchars(frontend_url('index.php')) ?>">
            <div class="brand-mark">🔎</div>
            <div>
                <div class="brand-title">Finder</div>
                <div class="brand-subtitle">by KAI</div>
            </div>
        </a>

        <button class="mobile-nav-toggle" id="mobileNavToggle" type="button" aria-label="Toggle navigation">☰</button>

        <nav class="main-nav" id="mainNav">
            <a href="<?= htmlspecialchars(frontend_url('index.php')) ?>" class="<?= $activePage === 'home' ? 'is-active' : '' ?>">Beranda</a>
            <a href="<?= htmlspecialchars(frontend_url('found.php')) ?>" class="<?= $activePage === 'found' ? 'is-active' : '' ?>">Barang Temuan</a>
            <a href="<?= htmlspecialchars(frontend_url('report-lost.php')) ?>" class="<?= $activePage === 'report-lost' ? 'is-active' : '' ?>">Lapor Kehilangan</a>
            <a href="<?= htmlspecialchars(frontend_url('reservation-list.php')) ?>" class="<?= $activePage === 'reservation-list' ? 'is-active' : '' ?>">Jadwal Ambil</a>
            <a href="<?= htmlspecialchars(frontend_url('profile.php')) ?>" class="<?= $activePage === 'profile' ? 'is-active' : '' ?>">Profil</a>
        </nav>

        <div class="nav-user" id="navUserArea">
            <a href="<?= htmlspecialchars(frontend_url('login.php')) ?>" class="btn btn-outline" id="navLoginBtn">Masuk</a>
        </div>
    </div>
</header>