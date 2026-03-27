<?php
$pageTitle = 'List of Lost - Petugas';
$pageClass = 'theme-app';
$activePage = 'officer-list-lost';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container">
            <div class="section-head">
                <div>
                    <span class="eyebrow">Manage Lost Reports</span>
                    <h1 class="page-title">Kelola seluruh laporan kehilangan</h1>
                </div>
            </div>
            <div class="toolbar-card">
                <form id="officerLostSearchForm" class="toolbar-grid officer-toolbar-grid-4">
                    <div class="form-group toolbar-search">
                        <label for="officerLostSearch">Search</label>
                        <input type="text" id="officerLostSearch" placeholder="Cari nama barang / deskripsi singkat">
                    </div>
                    <div class="form-group">
                        <label for="officerLostStatus">Status</label>
                        <select id="officerLostStatus">
                            <option value="">Semua status</option>
                            <option value="menunggu">Menunggu</option>
                            <option value="dicocokkan">Dicocokkan</option>
                            <option value="selesai">Selesai</option>
                            <option value="ditutup">Ditutup</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="officerLostLocationFilter">Lokasi</label>
                        <input type="text" id="officerLostLocationFilter" placeholder="Pilih stasiun dan peron...">
                    </div>
                    <div class="toolbar-actions">
                        <button type="submit" class="btn btn-primary">Cari</button>
                        <button type="button" class="btn btn-outline" id="resetOfficerLostSearch">Reset</button>
                    </div>
                </form>
            </div>
            <div id="officerLostState" class="empty-state soft">Memuat laporan kehilangan...</div>
            <div id="officerLostGrid" class="officer-list-grid"></div>
        </div>
    </section>
</main>

<div class="finder-modal" id="officerLostDetailModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog finder-modal-lg">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Detail Laporan Kehilangan</h3>
        <div id="officerLostDetailContent" class="modal-content-area"></div>
    </div>
</div>

<div class="finder-modal" id="officerLostEditModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog finder-modal-lg">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Edit Laporan Kehilangan</h3>
        <form id="officerLostEditForm" class="form-stack mt-16">
            <input type="hidden" id="officerEditLostId">
            <div class="form-group">
                <label for="officerEditLostName">Nama Barang</label>
                <input type="text" id="officerEditLostName" required>
            </div>
            <div class="form-grid-2">
                <div class="form-group">
                    <label for="officerEditLostDate">Tanggal</label>
                    <input type="date" id="officerEditLostDate" required>
                </div>
                <div class="form-group">
                    <label for="officerEditLostTime">Jam</label>
                    <input type="time" id="officerEditLostTime" required>
                </div>
            </div>
            <div class="form-group">
                <label for="officerEditLostLocation">Lokasi</label>
                <input type="text" id="officerEditLostLocation" placeholder="Pilih stasiun dan peron..." required>
            </div>
            <div class="form-group">
                <label for="officerEditLostDescription">Deskripsi</label>
                <textarea id="officerEditLostDescription" rows="5"></textarea>
            </div>
            <div class="form-group">
                <label for="officerEditLostStatus">Status</label>
                <select id="officerEditLostStatus">
                    <option value="menunggu">Menunggu</option>
                    <option value="dicocokkan">Dicocokkan</option>
                    <option value="selesai">Selesai</option>
                    <option value="ditutup">Ditutup</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Simpan Perubahan</button>
        </form>
    </div>
</div>
<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-officer-list-lost.js'; require_once __DIR__ . '/partials/footer.php'; ?>
