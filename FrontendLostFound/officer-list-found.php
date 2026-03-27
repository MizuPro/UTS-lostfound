<?php
$pageTitle = 'List of Found - Petugas';
$pageClass = 'theme-app';
$activePage = 'officer-list-found';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container">
            <div class="section-head">
                <div>
                    <span class="eyebrow">Manage Found Items</span>
                    <h1 class="page-title">Semua data barang temuan</h1>
                </div>
            </div>
            <div class="toolbar-card">
                <form id="officerFoundSearchForm" class="toolbar-grid officer-toolbar-grid-4">
                    <div class="form-group toolbar-search">
                        <label for="officerFoundSearch">Search</label>
                        <input type="text" id="officerFoundSearch" placeholder="Cari nama barang">
                    </div>
                    <div class="form-group">
                        <label for="officerFoundStatus">Status</label>
                        <select id="officerFoundStatus">
                            <option value="">Semua status</option>
                            <option value="tersimpan">Tersimpan</option>
                            <option value="dicocokkan">Dicocokkan</option>
                            <option value="diserahkan">Diserahkan</option>
                            <option value="selesai">Selesai</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="officerFoundLocationFilter">Lokasi</label>
                        <input type="text" id="officerFoundLocationFilter" placeholder="Pilih stasiun dan peron...">
                    </div>
                    <div class="toolbar-actions">
                        <button type="submit" class="btn btn-primary">Cari</button>
                        <button type="button" class="btn btn-outline" id="resetOfficerFoundSearch">Reset</button>
                    </div>
                </form>
            </div>
            <div id="officerFoundState" class="empty-state soft">Memuat barang temuan...</div>
            <div id="officerFoundGrid" class="cards-grid officer-found-grid"></div>
        </div>
    </section>
</main>

<div class="finder-modal" id="officerFoundDetailModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog finder-modal-lg">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Detail Barang Temuan</h3>
        <div id="officerFoundDetailContent" class="modal-content-area"></div>
    </div>
</div>

<div class="finder-modal" id="officerFoundEditModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog finder-modal-lg">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Edit Barang Temuan</h3>
        <form id="officerFoundEditForm" class="form-stack mt-16">
            <input type="hidden" id="officerEditFoundId">
            <div class="form-group">
                <label for="officerEditFoundName">Nama Barang</label>
                <input type="text" id="officerEditFoundName" required>
            </div>
            <div class="form-grid-2">
                <div class="form-group">
                    <label for="officerEditFoundDate">Tanggal</label>
                    <input type="date" id="officerEditFoundDate" required>
                </div>
                <div class="form-group">
                    <label for="officerEditFoundTime">Jam</label>
                    <input type="time" id="officerEditFoundTime" required>
                </div>
            </div>
            <div class="form-group">
                <label for="officerEditFoundLocation">Lokasi</label>
                <input type="text" id="officerEditFoundLocation" placeholder="Pilih stasiun dan peron..." required>
            </div>
            <div class="form-group">
                <label for="officerEditFoundDescription">Deskripsi</label>
                <textarea id="officerEditFoundDescription" rows="5"></textarea>
            </div>
            <div class="form-group">
                <label for="officerEditFoundStatus">Status</label>
                <select id="officerEditFoundStatus">
                    <option value="tersimpan">Tersimpan</option>
                    <option value="dicocokkan">Dicocokkan</option>
                    <option value="diserahkan">Diserahkan</option>
                </select>
            </div>
            <div class="form-group">
                <label for="officerEditFoundPhoto">Ganti Foto (Opsional)</label>
                <input type="file" id="officerEditFoundPhoto" accept="image/jpeg,image/png,image/webp">
            </div>
            <button type="submit" class="btn btn-primary btn-block">Simpan Perubahan</button>
        </form>
    </div>
</div>

<div class="finder-modal" id="officerFoundArchiveModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Tandai sebagai selesai</h3>
        <form id="officerFoundArchiveForm" class="form-stack mt-16">
            <input type="hidden" id="officerArchiveFoundId">
            <div class="form-group">
                <label for="officerArchiveFoundNote">Catatan Selesai</label>
                <textarea id="officerArchiveFoundNote" rows="4" placeholder="Contoh: Barang telah dikembalikan kepada pemilik."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Tandai selesai</button>
        </form>
    </div>
</div>
<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-officer-list-found.js'; require_once __DIR__ . '/partials/footer.php'; ?>
