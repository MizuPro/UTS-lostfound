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
                            <label for="matchSelect">Barang yang Dilaporkan Hilang <span class="required">*</span></label>
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

<div class="finder-modal" id="reviseScheduleModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Ajukan Revisi Jadwal</h3>
        <p style="margin-top: 8px; color: var(--text-soft); font-size: 14px; line-height: 1.6;">Masukkan waktu dan lokasi baru yang Anda inginkan. Permintaan akan dikirim ke petugas untuk disetujui kembali.</p>
        <form id="reviseScheduleForm" class="form-stack mt-16">
            <input type="hidden" id="reviseScheduleId">
            <div class="form-grid-2">
                <div class="form-group">
                    <label for="reviseDateInput">Tanggal Baru <span class="required">*</span></label>
                    <input type="date" id="reviseDateInput" required>
                </div>
                <div class="form-group">
                    <label for="reviseTimeInput">Waktu Baru <span class="required">*</span></label>
                    <input type="time" id="reviseTimeInput" required>
                </div>
            </div>
            <div class="form-group">
                <label for="reviseLocationInput">Lokasi Pengambilan Baru <span class="required">*</span></label>
                <input type="text" id="reviseLocationInput" placeholder="Contoh: Stasiun Bekasi" required>
            </div>
            <div class="form-group">
                <label for="reviseNoteInput">Alasan / Catatan (Opsional)</label>
                <textarea id="reviseNoteInput" rows="3" placeholder="Contoh: Saya tidak bisa datang di waktu semula karena ada keperluan mendadak..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Kirim Permohonan Revisi</button>
        </form>
    </div>
</div>

<?php $pageScript = 'assets/js/pages-reservation-list.js'; require_once __DIR__ . '/partials/footer.php'; ?>
