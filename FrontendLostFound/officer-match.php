<?php
$pageTitle = 'Match - Petugas';
$pageClass = 'theme-app';
$activePage = 'officer-match';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container">
            <div class="section-head">
                <div>
                    <span class="eyebrow">Matching Panel</span>
                    <h1 class="page-title">Cocokkan laporan dengan barang temuan</h1>
                    <p class="hero-text small">Pilih satu laporan dan satu barang yang paling sesuai, lalu lanjutkan proses verifikasi sampai penyerahan.</p>
                </div>
            </div>

            <div class="match-board">
                <section class="panel-card match-column">
                    <div class="inline-row between wrap-gap">
                        <h2>Laporan yang siap dicek</h2>
                        <div class="inline-row compact-filter">
                            <input type="text" id="matchLostSearch" placeholder="Cari laporan">
                            <button type="button" class="btn btn-outline" id="refreshMatchLost">Refresh</button>
                        </div>
                    </div>
                    <div id="matchLostList" class="match-card-list mt-16"></div>
                </section>

                <section class="panel-card match-column">
                    <div class="inline-row between wrap-gap">
                        <h2>Barang yang siap dicek</h2>
                        <div class="inline-row compact-filter">
                            <input type="text" id="matchFoundSearch" placeholder="Cari barang">
                            <button type="button" class="btn btn-outline" id="refreshMatchFound">Refresh</button>
                        </div>
                    </div>
                    <div id="matchFoundList" class="match-card-list mt-16"></div>
                </section>
            </div>

            <div class="match-action-bar panel-card mt-16">
                <div>
                    <h3>Pilihan saat ini</h3>
                    <p class="muted">Pilih satu data di kiri dan satu data di kanan untuk melanjutkan.</p>
                </div>
                <div class="inline-row wrap-gap">
                    <span id="selectedLostLabel" class="selection-chip">Belum memilih laporan</span>
                    <span id="selectedFoundLabel" class="selection-chip">Belum memilih barang</span>
                </div>
                <button type="button" class="btn btn-primary" id="openCreateMatchBtn" disabled>Buka Preview Match</button>
            </div>
        </div>
    </section>

    <section class="section-block no-top">
        <div class="container">
            <div class="panel-card">
                <div class="inline-row between wrap-gap">
                    <div>
                        <span class="eyebrow">Daftar pencocokan</span>
                    </div>
                    <div class="inline-row compact-filter">
                        <select id="matchStatusFilter">
                            <option value="">Semua status</option>
                            <option value="pending">Pending</option>
                            <option value="diverifikasi">Diverifikasi</option>
                            <option value="selesai">Selesai</option>
                            <option value="dibatalkan">Dibatalkan</option>
                        </select>
                        <button type="button" class="btn btn-outline" id="refreshMatchesBtn">Refresh</button>
                    </div>
                </div>
                <div id="matchState" class="empty-state soft">Memuat data match...</div>
                <div id="matchList" class="stack-list mt-16"></div>
            </div>
        </div>
    </section>
</main>

<div class="finder-modal" id="createMatchModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog finder-modal-xl">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Periksa kecocokan dengan teliti</h3>
        <div class="compare-grid mt-16">
            <div>
                <h4>Laporan Kehilangan</h4>
                <div id="createMatchLostPreview" class="detail-box compare-box"></div>
            </div>
            <div>
                <h4>Barang Temuan</h4>
                <div id="createMatchFoundPreview" class="detail-box compare-box"></div>
            </div>
        </div>
        <div class="helper-box mt-16 warning-box">Pastikan data sudah benar sebelum melanjutkan proses pencocokan.</div>
        <button type="button" class="btn btn-primary mt-16" id="confirmCreateMatchBtn">Lanjutkan pencocokan</button>
    </div>
</div>

<div class="finder-modal" id="matchActionModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3 id="matchActionTitle">Proses Match</h3>
        <form id="matchActionForm" class="form-stack mt-16">
            <input type="hidden" id="matchActionId">
            <input type="hidden" id="matchActionType">
            <div class="form-group">
                <label for="matchActionNote">Catatan</label>
                <textarea id="matchActionNote" rows="5" placeholder="Opsional. Isi catatan verifikasi / penyerahan / pembatalan."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block" id="matchActionSubmitBtn">Simpan</button>
        </form>
    </div>
</div>
<?php $pageScript = 'assets/js/pages-officer-match.js'; require_once __DIR__ . '/partials/footer.php'; ?>
