<?php
$pageTitle = 'Profile Petugas - Finder by KAI';
$pageClass = 'theme-app';
$activePage = '';
require_once __DIR__ . '/partials/head.php';
require_once __DIR__ . '/partials/navbar-officer.php';
?>
<main>
    <section class="section-block compact-top">
        <div class="container profile-hero officer-profile-hero">
            <div class="profile-avatar">👮</div>
            <h1 class="page-title">Selamat datang <span id="officerProfileNameText">Petugas</span></h1>
            <p class="hero-text small">Lihat data akun dan ringkasan pekerjaan Anda di sini.</p>
            <div class="profile-switch">
                <button type="button" class="tab-btn is-active" data-tab="profile">Profil</button>
                <button type="button" class="tab-btn" data-tab="overview">Ringkasan</button>
            </div>
        </div>
    </section>

    <section class="section-block no-top">
        <div class="container">
            <div id="profileTab" class="tab-panel is-active">
                <div class="panel-card profile-panel-grid">
                    <div>
                        <h2>Informasi Akun</h2>
                        <div id="officerProfileInfoBox" class="profile-data-list">
                            <div class="profile-data-item skeleton-line"></div>
                            <div class="profile-data-item skeleton-line"></div>
                            <div class="profile-data-item skeleton-line"></div>
                            <div class="profile-data-item skeleton-line"></div>
                        </div>
                    </div>

                    <div>
                        <h2>Pengaturan Akun</h2>
                        <div class="action-stack">
                            <button type="button" class="btn btn-primary" id="openOfficerEditProfileBtn">Edit Profil</button>
                            <button type="button" class="btn btn-secondary" id="openOfficerChangePasswordBtn">Ganti Password</button>
                            <button type="button" class="btn btn-outline danger-outline" id="officerLogoutBtn">Log Out</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="overviewTab" class="tab-panel">
                <div class="quick-grid-3" id="officerOverviewCards">
                    <article class="metric-card"><strong>Barang temuan aktif</strong><span>Memuat...</span></article>
                    <article class="metric-card"><strong>Laporan menunggu</strong><span>Memuat...</span></article>
                    <article class="metric-card"><strong>Match pending</strong><span>Memuat...</span></article>
                </div>
            </div>
        </div>
    </section>
</main>

<div class="finder-modal" id="officerEditProfileModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Edit Profil</h3>
        <form id="officerEditProfileForm" class="form-stack mt-16">
            <div class="form-group">
                <label for="officerEditName">Nama</label>
                <input type="text" id="officerEditName" required>
            </div>
            <div class="form-group">
                <label for="officerEditEmail">Email</label>
                <input type="email" id="officerEditEmail" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Simpan Perubahan</button>
        </form>
    </div>
</div>

<div class="finder-modal" id="officerChangePasswordModal" hidden>
    <div class="finder-modal-backdrop" data-close-modal></div>
    <div class="finder-modal-dialog">
        <button class="finder-modal-close" type="button" data-close-modal>&times;</button>
        <h3>Ubah Password</h3>
        <form id="officerChangePasswordForm" class="form-stack mt-16">
            <div class="form-group">
                <label for="officerCurrentPassword">Password Saat Ini</label>
                <div class="password-input-wrap">
                    <input type="password" id="officerCurrentPassword" required>
                    <button type="button" class="toggle-password" data-target="officerCurrentPassword">👁</button>
                </div>
            </div>
            <div class="form-group">
                <label for="officerNewPassword">Password Baru</label>
                <div class="password-input-wrap">
                    <input type="password" id="officerNewPassword" minlength="8" required>
                    <button type="button" class="toggle-password" data-target="officerNewPassword">👁</button>
                </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Submit</button>
        </form>
    </div>
</div>
<?php $pageScript = 'assets/js/pages-officer-profile.js'; require_once __DIR__ . '/partials/footer.php'; ?>
