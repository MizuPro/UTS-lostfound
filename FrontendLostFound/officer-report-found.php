<?php
$pageTitle = 'Report Found - Petugas';
$pageClass = 'theme-app';
$activePage = 'officer-report-found';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container report-layout">
            <div class="section-head left-align narrow-bottom">
                <div>
                    <span class="eyebrow">Report Found</span>
                    <h1 class="page-title">Masukkan data barang temuan baru</h1>
                    <p class="hero-text small">Isi data barang yang ditemukan agar proses pencarian pemilik bisa segera dilakukan.</p>
                </div>
            </div>

            <div class="report-shell report-shell-wide">
                <div class="report-card">
                    <h2>Data Petugas</h2>
                    <div id="officerFoundProfileInfo" class="profile-info-grid skeleton-grid">
                        <div class="info-line"></div>
                        <div class="info-line"></div>
                        <div class="info-line"></div>
                    </div>
                    <div class="helper-box mt-16">Data akun petugas ditampilkan otomatis dari akun yang sedang login.</div>
                </div>

                <div class="report-card">
                    <h2>Informasi Barang Temuan</h2>
                    <form id="foundItemForm" class="form-stack" enctype="multipart/form-data">
                        <div class="form-group">
                            <label for="foundItemName">Nama Barang <span class="required">*</span></label>
                            <input type="text" id="foundItemName" placeholder="Contoh: Dompet hitam" required>
                        </div>
                        <div class="form-grid-2">
                            <div class="form-group">
                                <label for="foundDate">Tanggal Temuan <span class="required">*</span></label>
                                <input type="date" id="foundDate" required>
                            </div>
                            <div class="form-group">
                                <label for="foundTime">Jam Temuan <span class="required">*</span></label>
                                <input type="time" id="foundTime" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="foundLocation">Lokasi Temuan <span class="required">*</span></label>
                            <input type="text" id="foundLocation" placeholder="Pilih stasiun..." required>
                        </div>
                        <div class="form-group">
                            <label for="foundDescription">Detail Barang</label>
                            <textarea id="foundDescription" rows="6" placeholder="Jelaskan ciri barang sedetail mungkin."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="foundPhoto">Foto Barang (Opsional)</label>
                            <input type="file" id="foundPhoto" accept="image/jpeg,image/png,image/webp">
                            <span class="helper-text">Format: JPEG/PNG/WebP, maksimal 5 MB.</span>
                        </div>
                        <button type="submit" class="btn btn-primary btn-wide">Simpan data</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-officer-report-found.js'; require_once __DIR__ . '/partials/footer.php'; ?>
