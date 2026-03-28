<?php
$pageTitle = 'Report Lost - Finder by KAI';
$pageClass = 'theme-app';
$activePage = 'report-lost';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container report-layout">
            <div class="section-head left-align narrow-bottom">
                <div>
                <span class="eyebrow">Report Lost</span>
                <h1 class="page-title">Laporkan barang yang hilang</h1>
                <p class="hero-text small">Isi informasi barang Anda sejelas mungkin agar petugas lebih mudah membantu.</p>
                </div>
            </div>

            <div class="report-shell">
                <div class="report-card">
                    <h2>Data Akun</h2>
                    <div id="reportProfileInfo" class="profile-info-grid skeleton-grid">
                        <div class="info-line"></div>
                        <div class="info-line"></div>
                        <div class="info-line"></div>
                    </div>
                </div>

                <div class="report-card">
                    <h2>Informasi Barang Hilang</h2>
                    <form id="lostReportForm" class="form-stack">
                        <div class="form-group">
                            <label for="lostItemName">Nama Barang <span class="required">*</span></label>
                            <input type="text" id="lostItemName" name="nama_barang" placeholder="Contoh: Dompet hitam" required>
                        </div>
                        <div class="form-grid-2">
                            <div class="form-group">
                                <label for="lostItemType">Jenis Barang</label>
                                <select id="lostItemType" name="jenis_barang">
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
                                <label for="lostDate">Tanggal Hilang <span class="required">*</span></label>
                                <input type="date" id="lostDate" required>
                            </div>
                        </div>

                        <div class="form-grid-2">
                            <div class="form-group">
                                <label for="lostTime">Jam Hilang <span class="required">*</span></label>
                                <input type="time" id="lostTime" required>
                            </div>
                            <div class="form-group">
                                <label for="lostLocation">Lokasi Kehilangan <span class="required">*</span></label>
                                <input type="text" id="lostLocation" name="lokasi" placeholder="Pilih stasiun..." required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="lostDescription">Detail Barang <span class="required">*</span></label>
                            <textarea id="lostDescription" name="deskripsi" rows="6" placeholder="Jelaskan ciri barang sedetail mungkin. Contoh: warna, merek, ukuran, isi, dan ciri khusus lainnya." required></textarea>
                        </div>

                        <div class="upload-card disabled-upload">
                            <h3>Unggah foto belum tersedia</h3>
                            <p>Saat ini laporan kehilangan belum mendukung unggah foto. Anda tetap bisa menjelaskan ciri barang selengkap mungkin pada kolom detail.</p>
                        </div>

                        <button type="submit" class="btn btn-primary btn-wide">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>
<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-report-lost.js'; require_once __DIR__ . '/partials/footer.php'; ?>
