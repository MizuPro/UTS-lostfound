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
            <div class="section-head left-align narrow-bottom">
                <div>
                    <span class="eyebrow">Jadwal Pengambilan</span>
                    <h1 class="page-title">Kelola Jadwal Pengambilan</h1>
                    <p class="hero-text small">Tinjau, ubah, atau selesaikan jadwal pengambilan barang oleh pelapor.</p>
                </div>
            </div>

            <div class="report-shell">
                <div class="report-card">
                    <h2>Pilih Pencocokan / Jadwal</h2>
                    <p class="helper-box mb-16">Pilih jadwal berdasarkan laporan yang sudah dicocokkan. Anda dapat menyetujui, mencocokkan ulang, atau menyelesaikan serah terima barang di sini.</p>
                    <div class="form-group">
                        <label for="matchSelect">Pilih Barang Hilang / Jadwal</label>
                        <select id="matchSelect">
                            <option value="">-- Memuat data... --</option>
                        </select>
                        <div id="loadingIndicator" style="display:none; margin-top: 8px; font-size: 0.875rem; color: #666;">
                            🔄 Memuat detail...
                        </div>
                    </div>
                </div>

                <div class="report-card" id="scheduleDetailCard" style="display:none;">
                    <h2>Detail Jadwal</h2>
                    <form id="reservationForm" class="form-stack">
                        <input type="hidden" id="scheduleId">

                        <div class="form-grid-2">
                            <div class="form-group">
                                <label>Nama Pelapor</label>
                                <input type="text" id="pelaporName" disabled>
                            </div>
                            <div class="form-group">
                                <label>Email Pelapor</label>
                                <input type="text" id="pelaporEmail" disabled>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Nama Barang (Laporan)</label>
                            <input type="text" id="laporanBarang" disabled>
                        </div>

                        <div class="form-grid-2">
                            <div class="form-group">
                                <label for="scheduleDate">Tanggal Pengambilan</label>
                                <input type="date" id="scheduleDate" required>
                            </div>
                            <div class="form-group">
                                <label for="scheduleTime">Waktu Pengambilan</label>
                                <input type="time" id="scheduleTime" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="scheduleLocation">Lokasi Pengambilan</label>
                            <input type="text" id="scheduleLocation" required>
                        </div>

                        <div class="form-group">
                            <label for="scheduleNote">Catatan / Pesan</label>
                            <textarea id="scheduleNote" rows="3"></textarea>
                        </div>

                        <div class="form-group">
                            <label>Status Jadwal</label>
                            <div id="scheduleStatusBadge" class="status-badge"></div>
                        </div>

                        <div class="action-buttons mt-16" id="actionButtons">
                            <!-- Buttons rendered dynamically -->
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-officer-reservation.js'; require_once __DIR__ . '/partials/footer.php'; ?>
