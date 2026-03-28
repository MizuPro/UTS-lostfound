<?php
$pageTitle = 'Jadwal Pengambilan - Finder by KAI';
$pageClass = 'theme-app';
$activePage = 'reservation-list';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container report-layout">
            <div class="section-head left-align narrow-bottom">
                <div>
                    <span class="eyebrow">Reservasi Anda</span>
                    <h1 class="page-title">Jadwal Pengambilan</h1>
                    <p class="hero-text small">Daftar jadwal pengambilan untuk barang yang telah diverifikasi.</p>
                </div>
            </div>

            <div class="report-shell report-shell-wide">
                <div class="report-card">
                    <h2>Buat Jadwal Baru</h2>
                    <p class="helper-box mb-16">Pilih laporan kehilangan yang sudah terverifikasi kecocokannya dengan barang temuan, lalu ajukan jadwal pengambilan di stasiun.</p>
                    <form id="proposeScheduleForm" class="form-stack">
                        <div class="form-group">
                            <label for="matchSelect">Laporan (Match ID) <span class="required">*</span></label>
                            <select id="matchSelect" required>
                                <option value="">-- Memuat data... --</option>
                            </select>
                        </div>

                        <div class="form-grid-2">
                            <div class="form-group">
                                <label for="scheduleDate">Tanggal Pengambilan <span class="required">*</span></label>
                                <input type="date" id="scheduleDate" required>
                            </div>
                            <div class="form-group">
                                <label for="scheduleTime">Waktu Pengambilan <span class="required">*</span></label>
                                <input type="time" id="scheduleTime" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="scheduleLocation">Lokasi Pengambilan <span class="required">*</span></label>
                            <input type="text" id="scheduleLocation" placeholder="Contoh: Stasiun Jakarta Kota" required>
                        </div>

                        <div class="form-group">
                            <label for="scheduleNote">Catatan / Pesan untuk Petugas (Opsional)</label>
                            <textarea id="scheduleNote" rows="3" placeholder="Contoh: Saya akan tiba menggunakan KRL arah Bogor..."></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary" id="btnSubmit" style="width: 100%;">Ajukan Jadwal</button>
                    </form>
                </div>

                <div class="report-card">
                    <h2>Riwayat Jadwal</h2>
                    <div id="scheduleLoadingIndicator" style="display:none; font-size: 0.875rem; color: #666; margin-bottom: 1rem;">
                        🔄 Memuat riwayat jadwal...
                    </div>
                    <div id="scheduleListContainer">
                        <div class="skeleton-grid">
                            <div class="info-line"></div><div class="info-line"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-reservation-list.js'; require_once __DIR__ . '/partials/footer.php'; ?>
