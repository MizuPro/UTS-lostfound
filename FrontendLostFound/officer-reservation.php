<?php
$pageTitle = 'Reservation - Petugas';
$pageClass = 'theme-app';
$activePage = 'officer-reservation';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container">
            <div class="section-head">
                <div>
                    <span class="eyebrow">Jadwal Pengambilan</span>
                    <h1 class="page-title">Buat jadwal pengambila</h1>
                    <p class="hero-text small">Fitur ini belum aktif karena backend belum menyediakan modul jadwal pengambilan.</p>
                </div>
            </div>
            <div class="panel-card reservation-disabled-card">
                <div class="form-stack disabled-area">
                    <div class="form-grid-2">
                        <div class="form-group"><label>Nama</label><input type="text" disabled placeholder="Belum aktif"></div>
                        <div class="form-group"><label>Email</label><input type="text" disabled placeholder="Belum aktif"></div>
                    </div>
                    <div class="form-grid-2">
                        <div class="form-group"><label>Barang</label><input type="text" disabled placeholder="Belum aktif"></div>
                        <div class="form-group"><label>Lokasi Pengambilan</label><input type="text" disabled placeholder="Belum aktif"></div>
                    </div>
                    <button type="button" class="btn btn-outline" disabled>Submit</button>
                </div>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/footer.php'; ?>
