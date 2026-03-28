<?php
$pageTitle = 'Report Lost - Petugas';
$pageClass = 'theme-app';
$activePage = 'officer-report-lost';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container report-layout">
            <div class="section-head left-align narrow-bottom">
                <div>
                    <span class="eyebrow">Report Lost</span>
                    <h1 class="page-title">Masukkan laporan kehilangan</h1>
                    <p class="hero-text small">Gunakan halaman ini jika petugas perlu membantu memasukkan laporan secara manual.</p>
                </div>
            </div>

            <div class="report-shell report-shell-wide">
                <div class="report-card">
                    <h2>Data Petugas</h2>
                    <div id="officerLostProfileInfo" class="profile-info-grid skeleton-grid">
                        <div class="info-line"></div>
                        <div class="info-line"></div>
                        <div class="info-line"></div>
                    </div>
                    <div class="helper-box mt-16">Laporan akan tersimpan menggunakan akun yang sedang dipakai saat ini.</div>
                </div>

                <div class="report-card">
                    <h2>Informasi Laporan Kehilangan</h2>
                    <form id="officerLostReportForm" class="form-stack">
                        <div class="form-group">
                            <label for="officerLostItemName">Nama Barang <span class="required">*</span></label>
                            <input type="text" id="officerLostItemName" placeholder="Contoh: Tas ransel biru" required>
                        </div>
                        <div class="form-grid-2">
                            <div class="form-group">
                                <label for="officerLostItemType">Jenis Barang</label>
                                <select id="officerLostItemType">
                                    <option value="">Pilih jenis barang</option>
                                    <option value="Tas">Tas</option>
                                    <option value="Dompet">Dompet</option>
                                    <option value="Ponsel">Ponsel</option>
                                    <option value="Laptop">Laptop</option>
                                    <option value="Aksesoris">Aksesoris</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="officerLostDate">Tanggal Hilang <span class="required">*</span></label>
                                <input type="date" id="officerLostDate" required>
                            </div>
                        </div>
                        <div class="form-grid-2">
                            <div class="form-group">
                                <label for="officerLostTime">Jam Hilang <span class="required">*</span></label>
                                <input type="time" id="officerLostTime" required>
                            </div>
                            <div class="form-group">
                                <label for="officerLostLocation">Lokasi Kehilangan <span class="required">*</span></label>
                                <input type="text" id="officerLostLocation" placeholder="Pilih stasiun..." required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="officerLostDescription">Detail Barang <span class="required">*</span></label>
                            <textarea id="officerLostDescription" rows="6" placeholder="Jelaskan ciri barang sedetail mungkin." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-wide">Simpan laporan</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-officer-report-lost.js'; require_once __DIR__ . '/partials/footer.php'; ?>
