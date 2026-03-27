<?php require_once __DIR__ . '/../includes/url.php'; ?>
<?php $isOfficerPage = isset($activePage) && strpos((string)$activePage, 'officer-') === 0; ?>
<footer class="site-footer">
    <div class="container footer-grid">
        <div>
            <div class="footer-brand">
                <div class="brand-mark footer-mark">🔎</div>
                <div>
                    <div class="brand-title">Finder</div>
                    <div class="brand-subtitle">by KAI</div>
                </div>
            </div>
            <p class="footer-copy"><?= $isOfficerPage ? 'Finder membantu petugas mencatat barang temuan, mengelola laporan kehilangan, dan memproses pencocokan dengan lebih rapi dan cepat.' : 'Finder membantu penumpang melihat barang temuan, membuat laporan kehilangan, dan memantau prosesnya dengan lebih mudah.' ?></p>
            <p class="footer-note">© Finder by KAI. co.id, 2026</p>
        </div>

        <div>
            <h3>Navigasi</h3>
            <ul class="footer-list">
                <?php if ($isOfficerPage): ?>
                    <li><a href="<?= htmlspecialchars(frontend_url('officer-home.php')) ?>">Beranda Petugas</a></li>
                    <li><a href="<?= htmlspecialchars(frontend_url('officer-list-lost.php')) ?>">Daftar Laporan Hilang</a></li>
                    <li><a href="<?= htmlspecialchars(frontend_url('officer-list-found.php')) ?>">Daftar Barang Temuan</a></li>
                    <li><a href="<?= htmlspecialchars(frontend_url('officer-match.php')) ?>">Pencocokan</a></li>
                <?php else: ?>
                    <li><a href="<?= htmlspecialchars(frontend_url('index.php')) ?>">Beranda</a></li>
                    <li><a href="<?= htmlspecialchars(frontend_url('found.php')) ?>">Barang Temuan</a></li>
                    <li><a href="<?= htmlspecialchars(frontend_url('report-lost.php')) ?>">Lapor Kehilangan</a></li>
                    <li><a href="<?= htmlspecialchars(frontend_url('profile.php')) ?>">Profil</a></li>
                <?php endif; ?>
            </ul>
        </div>

        <div>
            <h3>Bantuan</h3>
            <ul class="footer-list">
                <li><span>Layanan pelanggan</span></li>
                <li><span>Syarat &amp; ketentuan</span></li>
                <li><span>Pusat bantuan operasional stasiun</span></li>
            </ul>
        </div>

        <div>
            <h3><?= $isOfficerPage ? 'Catatan sistem' : 'Catatan layanan' ?></h3>
            <p class="footer-copy small"><?= $isOfficerPage ? 'Fitur jadwal pengambilan masih berupa tampilan awal karena backend belum menyediakan modul tersebut.' : 'Beberapa fitur seperti lupa password, nomor telepon, gender, dan unggah foto pada laporan kehilangan belum tersedia di backend saat ini.' ?></p>
        </div>
    </div>
</footer>
<?php require_once __DIR__ . '/chat-widget.php'; ?>
<?php if (!empty($pageScript)): ?>
<script>window.APP_PAGE_SCRIPT = <?= json_encode($pageScript) ?>;</script>
<?php endif; ?>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= htmlspecialchars(asset_url('js/app.js')) ?>"></script>
<script src="<?= htmlspecialchars(asset_url('js/krl-location.js')) ?>"></script>
<script src="<?= htmlspecialchars(asset_url('js/chat.js')) ?>"></script>
<?php if (!empty($pageScript)): ?>
<script src="<?= htmlspecialchars(frontend_url($pageScript)) ?>"></script>
<?php endif; ?>
</body>
</html>