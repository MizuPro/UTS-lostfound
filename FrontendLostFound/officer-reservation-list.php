<?php
$pageTitle = 'Reservation List - Petugas';
$pageClass = 'theme-app';
$activePage = 'officer-reservation-list';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container">
            <div class="section-head">
                <div>
                    <span class="eyebrow">Jadwal Pengambilan</span>
                    <h1 class="page-title">Daftar jadwal pengambilan</h1>
                    <p class="hero-text small">Daftar jadwal pengambilan belum tersedia karena backend belum menyediakan modul ini.</p>
                </div>
            </div>
            <div class="panel-card reservation-disabled-card">
            <div class="empty-state soft">Fitur ini belum aktif saat ini, tetapi tampilannya sudah disiapkan untuk pengembangan berikutnya.</div>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/footer.php'; ?>
