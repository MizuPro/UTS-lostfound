<?php
$pageTitle = 'Found - Finder by KAI';
$pageClass = 'theme-app';
$activePage = 'found';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container page-head-split">
            <div>
            <span class="eyebrow">Found Items</span>
            <h1 class="page-title">Lihat daftar barang temuan</h1>
            <p class="hero-text small">Anda bisa melihat daftar barang yang sudah ditemukan. Beberapa detail disembunyikan demi keamanan proses klaim.</p>
            </div>
            <div class="ad-panel">Informasi layanan Finder</div>
        </div>
    </section>

    <section class="section-block no-top">
        <div class="container content-grid-with-side">
            <div>
                <div class="toolbar-card">
                    <form id="foundSearchForm" class="toolbar-grid">
                        <div class="form-group toolbar-search">
                            <label for="searchFound">Search</label>
                            <input type="text" id="searchFound" name="search" placeholder="Cari nama barang">
                        </div>
                        <div class="form-group">
                            <label for="statusFound">Status</label>
                            <select id="statusFound" name="status">
                                <option value="">Semua status</option>
                                <option value="tersimpan">Tersimpan</option>
                                <option value="dicocokkan">Dicocokkan</option>
                                <option value="diserahkan">Diserahkan</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>
                        <div class="toolbar-actions">
                            <button type="submit" class="btn btn-primary">Cari</button>
                            <button type="button" class="btn btn-outline" id="resetFoundSearch">Reset</button>
                        </div>
                    </form>
                </div>

                <div id="foundListState" class="empty-state soft">Memuat data barang temuan...</div>
                <div id="foundGrid" class="cards-grid"></div>
            </div>

            <aside class="side-note-card">
                <h3>Mengapa detail dibatasi?<h3>
                <p>Beberapa informasi tidak ditampilkan penuh agar proses klaim tetap aman dan diperiksa langsung oleh petugas.</p>
            </aside>
        </div>
    </section>
</main>

<div class="finder-modal" id="foundDetailModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Detail Barang Temuan</h3>
        <div id="foundDetailContent" class="modal-content-area"></div>
    </div>
</div>
<?php $pageScript = 'assets/js/pages-found.js'; require_once __DIR__ . '/partials/footer.php'; ?>
