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
                    <h1 class="page-title">Daftar Jadwal Pengambilan</h1>
                    <p class="hero-text small">Melihat riwayat dan status jadwal pengambilan barang.</p>
                </div>
            </div>
            <div class="panel-card mt-24">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Match ID</th>
                                <th>Pelapor</th>
                                <th>Jadwal</th>
                                <th>Lokasi</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="schedulesTableBody">
                            <tr>
                                <td colspan="6" class="text-center">Memuat data jadwal...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</main>
<?php $pageScript = 'assets/js/pages-officer-reservation-list.js'; require_once __DIR__ . '/partials/footer.php'; ?>
