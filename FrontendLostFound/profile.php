 <?php
$pageTitle = 'Profile - Finder by KAI';
$pageClass = 'theme-app';
$activePage = 'profile';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container profile-hero">
            <div class="profile-avatar">👤</div>
            <h1 class="page-title">Selamat datang <span id="profileNameText">Pengguna</span></h1>
            <p class="hero-text small">Di sini Anda bisa melihat data akun dan memantau perkembangan laporan Anda.</p>
            <div class="profile-switch">
                <button type="button" class="tab-btn is-active" data-tab="profile">Profil</button>
                <button type="button" class="tab-btn" data-tab="reports">Laporan Saya</button>
            </div>
        </div>
    </section>

    <section class="section-block no-top">
        <div class="container">
            <div id="profileTab" class="tab-panel is-active">
                <div class="panel-card profile-panel-grid">
                    <div>
                        <h2>Informasi Akun</h2>
                        <div id="profileInfoBox" class="profile-data-list">
                            <div class="profile-data-item skeleton-line"></div>
                            <div class="profile-data-item skeleton-line"></div>
                            <div class="profile-data-item skeleton-line"></div>
                            <div class="profile-data-item skeleton-line"></div>
                        </div>
                    </div>

                    <div>
                        <h2>Pengaturan Akun</h2>
                        <div class="action-stack">
                            <button type="button" class="btn btn-primary" id="openEditProfileBtn">Edit Profil</button>
                            <button type="button" class="btn btn-secondary" id="openChangePasswordBtn">Ganti Password</button>
                            <button type="button" class="btn btn-outline danger-outline" id="logoutBtn">Log Out</button>
                        </div>
                        <div class="helper-box mt-16">Fitur lupa password belum tersedia. Anda tetap bisa mengganti password setelah login.</div>
                    </div>
                </div>
            </div>

            <div id="reportsTab" class="tab-panel">
                <div class="panel-card">
                    <div class="inline-row between wrap-gap">
                        <div>
                            <h2>Laporan kehilangan saya</h2>
                            <p class="muted">Halaman ini menampilkan laporan milik akun yang sedang login.</p>
                        </div>
                        <button type="button" class="btn btn-outline" id="refreshReportsBtn">Refresh</button>
                    </div>
                    <div id="reportListState" class="empty-state soft">Memuat laporan kehilangan...</div>
                    <div id="reportCards" class="report-status-list"></div>
                </div>
            </div>
        </div>
    </section>
</main>

<div class="finder-modal" id="editProfileModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Edit Profil</h3>
        <form id="editProfileForm" class="form-stack mt-16">
            <div class="form-group">
                <label for="editName">Nama</label>
                <input type="text" id="editName" name="name" required>
            </div>
            <div class="form-group">
                <label for="editEmail">Email</label>
                <input type="email" id="editEmail" name="email" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Simpan Perubahan</button>
        </form>
    </div>
</div>

<div class="finder-modal" id="changePasswordModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Ubah Password</h3>
        <form id="changePasswordForm" class="form-stack mt-16">
            <div class="form-group">
                <label for="currentPassword">Password Saat Ini</label>
                <div class="password-input-wrap">
                    <input type="password" id="currentPassword" name="current_password" required>
                    <button type="button" class="toggle-password" data-target="currentPassword">👁</button>
                </div>
            </div>
            <div class="form-group">
                <label for="newPassword">Password Baru</label>
                <div class="password-input-wrap">
                    <input type="password" id="newPassword" name="new_password" minlength="8" required>
                    <button type="button" class="toggle-password" data-target="newPassword">👁</button>
                </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Submit</button>
        </form>
    </div>
</div>

<div class="finder-modal" id="reportDetailModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog finder-modal-lg">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Detail Laporan</h3>
        <div id="reportDetailContent" class="modal-content-area"></div>
    </div>
</div>

<div class="finder-modal" id="editReportModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog finder-modal-lg">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Edit Laporan</h3>
        <form id="editReportForm" class="form-stack mt-16">
            <input type="hidden" id="editReportId">
            <div class="form-group">
                <label for="editReportName">Nama Barang</label>
                <input type="text" id="editReportName" name="nama_barang" required>
            </div>
            <div class="form-grid-2">
                <div class="form-group">
                    <label for="editReportDate">Tanggal</label>
                    <input type="date" id="editReportDate" required>
                </div>
                <div class="form-group">
                    <label for="editReportTime">Jam</label>
                    <input type="time" id="editReportTime" required>
                </div>
            </div>
            <div class="form-group">
                <label for="editReportLocation">Lokasi</label>
                <input type="text" id="editReportLocation" name="lokasi" placeholder="Pilih stasiun dan peron..." required>
            </div>
            <div class="form-group">
                <label for="editReportDescription">Deskripsi</label>
                <textarea id="editReportDescription" name="deskripsi" rows="5"></textarea>
            </div>
            <div class="form-group">
                <label for="editReportStatus">Status</label>
                <select id="editReportStatus" name="status">
                    <option value="menunggu">Menunggu</option>
                    <option value="ditutup">Ditutup</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Simpan Perubahan</button>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/partials/modal-location.php'; ?>
<?php $pageScript = 'assets/js/pages-profile.js'; require_once __DIR__ . '/partials/footer.php'; ?>
