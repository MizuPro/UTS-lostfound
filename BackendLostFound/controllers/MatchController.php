<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../helpers/ResponseHelper.php';
require_once __DIR__ . '/../helpers/ValidationHelper.php';
require_once __DIR__ . '/../models/MatchModel.php';
require_once __DIR__ . '/../models/FoundItemModel.php';
require_once __DIR__ . '/../models/LostReportModel.php';
require_once __DIR__ . '/../models/PickupScheduleModel.php';

/**
 * MatchController
 * Menangani operasi pencocokan barang temuan dengan laporan kehilangan
 *
 * Akses:
 *   index          => petugas
 *   show           => petugas, atau pelapor (jika laporannya terkait)
 *   matchItem      => petugas
 *   verifyClaim    => petugas
 *   recordHandover => petugas
 */
class MatchController
{
    /** @var MatchModel */
    private $matchModel;
    /** @var FoundItemModel */
    private $foundItemModel;
    /** @var LostReportModel */
    private $lostReportModel;
    /** @var PickupScheduleModel */
    private $scheduleModel;

    public function __construct()
    {
        $this->matchModel = new MatchModel();
        $this->foundItemModel = new FoundItemModel();
        $this->lostReportModel = new LostReportModel();
        $this->scheduleModel = new PickupScheduleModel();
    }

    // ── GET /api/matches ─────────────────────────────────────────────────────
    public function index(): void
    {
        $authUser = $GLOBALS['auth_user'] ?? null;
        $role = $authUser['role'] ?? '';
        $userId = (int) ($authUser['user_id'] ?? 0);

        $filters = [
            'status' => isset($_GET['status']) ? trim($_GET['status']) : '',
            'exclude_scheduled' => isset($_GET['exclude_scheduled']) ? trim($_GET['exclude_scheduled']) : '',
        ];

        // Validasi nilai status jika diberikan
        $validStatus = ['pending', 'diverifikasi', 'selesai', 'dibatalkan'];
        if ($filters['status'] !== '' && !in_array($filters['status'], $validStatus, true)) {
            ResponseHelper::error(
                'Nilai status tidak valid. Pilihan: pending, diverifikasi, selesai, dibatalkan.',
                422
            );
        }

        if ($role === ROLE_PELAPOR) {
            $filters['pelapor_id'] = $userId;
        }

        $matches = $this->matchModel->getAll($filters);

        ResponseHelper::success(
            ['matches' => $matches, 'total' => count($matches)],
            'Data pencocokan berhasil diambil.'
        );
    }

    // ── GET /api/matches/{id} ────────────────────────────────────────────────
    public function show(): void
    {
        $id = (int) ($GLOBALS['route_params']['id'] ?? 0);
        $match = $this->matchModel->findById($id);

        if (!$match) {
            ResponseHelper::notFound('Data pencocokan tidak ditemukan.');
        }

        $authUser = $GLOBALS['auth_user'] ?? null;
        $role = $authUser['role'] ?? '';
        $userId = (int) ($authUser['user_id'] ?? 0);

        // Jika pelapor, pastikan ia hanya melihat pencocokan laporannya sendiri
        if ($role === ROLE_PELAPOR && $match['pelapor_id'] !== $userId) {
            ResponseHelper::error('Akses ditolak. Anda tidak berhak melihat pencocokan ini.', 403);
        }

        ResponseHelper::success(
            ['match' => $match],
            'Detail pencocokan berhasil diambil.'
        );
    }

    // ── POST /api/matches ────────────────────────────────────────────────────
    public function matchItem(): void
    {
        $authUser = $GLOBALS['auth_user'] ?? null;
        $petugasId = (int) $authUser['user_id'];

        $input = ValidationHelper::sanitizeAll(ValidationHelper::getInput());
        $errors = ValidationHelper::required($input, ['barang_temuan_id', 'laporan_id']);
        if (!empty($errors)) {
            ResponseHelper::validationError($errors);
        }

        $barangId = (int) $input['barang_temuan_id'];
        $laporanId = (int) $input['laporan_id'];

        $barang = $this->foundItemModel->findById($barangId);
        if (!$barang) {
            ResponseHelper::notFound('Barang temuan tidak ditemukan.');
        }

        $laporan = $this->lostReportModel->findById($laporanId);
        if (!$laporan) {
            ResponseHelper::notFound('Laporan kehilangan tidak ditemukan.');
        }

        // Cek apakah barang / laporan sudah selesai / diserahkan
        if (in_array($barang['status'], ['diserahkan', 'selesai'])) {
            ResponseHelper::error('Barang temuan sudah diserahkan atau selesai, tidak dapat dicocokkan.', 409);
        }
        if (in_array($laporan['status'], ['selesai', 'ditutup'])) {
            ResponseHelper::error('Laporan kehilangan sudah selesai atau ditutup, tidak dapat dicocokkan.', 409);
        }

        // Cek duplikasi
        $existing = $this->matchModel->findActiveMatch($barangId, $laporanId);
        if ($existing) {
            ResponseHelper::error('Pencocokan untuk barang dan laporan ini sudah ada (aktif).', 409);
        }

        // Cek apakah barang/laporan sedang dalam status pending/diverifikasi dengan pasangannya yang lain
        if ($this->foundItemModel->hasActiveMatch($barangId)) {
            ResponseHelper::error('Barang temuan sedang dalam proses pencocokan aktif dengan laporan lain.', 409);
        }
        if ($this->lostReportModel->hasActiveMatch($laporanId)) {
            ResponseHelper::error('Laporan kehilangan sedang dalam proses pencocokan aktif dengan barang lain.', 409);
        }

        try {
            // Gunakan transaksi
            $db = Database::getInstance();
            $db->beginTransaction();

            $matchId = $this->matchModel->create([
                'barang_temuan_id' => $barangId,
                'laporan_id' => $laporanId,
                'petugas_id' => $petugasId,
                'status' => 'pending'
            ]);

            // Update status barang dan laporan menjadi 'dicocokkan'
            $this->foundItemModel->update($barangId, array_merge($barang, ['status' => 'dicocokkan']));
            $this->lostReportModel->update($laporanId, array_merge($laporan, ['status' => 'dicocokkan']));

            $db->commit();

            $match = $this->matchModel->findById($matchId);
            ResponseHelper::success(
                ['match' => $match],
                'Barang temuan dan laporan kehilangan berhasil dicocokkan (status: pending).',
                201
            );

        } catch (\Exception $e) {
            $db->rollBack();
            ResponseHelper::error('Terjadi kesalahan saat menyimpan pencocokan: ' . $e->getMessage(), 500);
        }
    }

    // ── PUT /api/matches/{id}/verify ─────────────────────────────────────────
    public function verifyClaim(): void
    {
        $id = (int) ($GLOBALS['route_params']['id'] ?? 0);
        $match = $this->matchModel->findById($id);

        if (!$match) {
            ResponseHelper::notFound('Data pencocokan tidak ditemukan.');
        }

        if ($match['status'] !== 'pending') {
            ResponseHelper::error('Hanya pencocokan berstatus pending yang dapat diverifikasi.', 409);
        }

        $input = ValidationHelper::sanitizeAll(ValidationHelper::getInput());
        $catatan = isset($input['catatan']) ? trim($input['catatan']) : null;

        $this->matchModel->updateStatus($id, 'diverifikasi', $catatan);

        $updatedMatch = $this->matchModel->findById($id);
        ResponseHelper::success(
            ['match' => $updatedMatch],
            'Pencocokan berhasil diverifikasi (status: diverifikasi).'
        );
    }

    // ── PUT /api/matches/{id}/handover ───────────────────────────────────────
    public function recordHandover(): void
    {
        $id = (int) ($GLOBALS['route_params']['id'] ?? 0);
        $match = $this->matchModel->findById($id);

        if (!$match) {
            ResponseHelper::notFound('Data pencocokan tidak ditemukan.');
        }

        if ($match['status'] !== 'diverifikasi') {
            ResponseHelper::error('Hanya pencocokan berstatus diverifikasi yang dapat diselesaikan handovers-nya.', 409);
        }

        $authUser = $GLOBALS['auth_user'] ?? null;
        $petugasId = (int) ($authUser['user_id'] ?? 0);

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (strpos($contentType, 'multipart/form-data') !== false) {
            $input = ValidationHelper::sanitizeAll($_POST);
        } else {
            $input = ValidationHelper::sanitizeAll(ValidationHelper::getInput());
        }

        $catatan = isset($input['catatan']) ? trim($input['catatan']) : 'Handover diselesaikan oleh petugas';
        $waktuSerah = date('Y-m-d H:i:s');

        if (empty($_FILES['foto_bukti_serah']) || $_FILES['foto_bukti_serah']['error'] === UPLOAD_ERR_NO_FILE) {
            ResponseHelper::validationError([
                'foto_bukti_serah' => 'Foto bukti handover wajib diunggah.'
            ]);
        }

        $fotoBuktiSerah = null;

        try {
            $fotoBuktiSerah = $this->handleHandoverPhotoUpload($_FILES['foto_bukti_serah']);

            $db = Database::getInstance();
            $db->beginTransaction();

            $this->matchModel->updateStatus(
                $id,
                'selesai',
                $catatan,
                $waktuSerah,
                $fotoBuktiSerah
            );

            $this->foundItemModel->archive($match['barang_temuan_id'], $catatan);

            $laporan = $this->lostReportModel->findById((int) $match['laporan_id']);
            if ($laporan) {
                $this->lostReportModel->update((int) $match['laporan_id'], array_merge($laporan, ['status' => 'selesai']));
            }

            $activeSchedule = $this->scheduleModel->findActiveByMatchId($id);
            if ($activeSchedule) {
                $this->scheduleModel->updateStatus((int) $activeSchedule['id'], 'selesai', $petugasId, $catatan, $waktuSerah);
            }

            $db->commit();

            $updatedMatch = $this->matchModel->findById($id);
            ResponseHelper::success(
                ['match' => $updatedMatch],
                'Handover berhasil dicatat beserta foto bukti.'
            );

        } catch (\Exception $e) {
            if (isset($db) && $db->inTransaction()) {
                $db->rollBack();
            }

            if ($fotoBuktiSerah) {
                $uploadedFile = __DIR__ . '/../storage/' . $fotoBuktiSerah;
                if (file_exists($uploadedFile)) {
                    @unlink($uploadedFile);
                }
            }

            ResponseHelper::error('Terjadi kesalahan saat mencatat handover: ' . $e->getMessage(), 500);
        }
    }

    // ── PUT /api/matches/{id}/cancel ─────────────────────────────────────────
    public function cancelMatch(): void
    {
        $id = (int) ($GLOBALS['route_params']['id'] ?? 0);
        $match = $this->matchModel->findById($id);

        if (!$match) {
            ResponseHelper::notFound('Data pencocokan tidak ditemukan.');
        }

        if (!in_array($match['status'], ['pending', 'diverifikasi'])) {
            ResponseHelper::error('Hanya pencocokan berstatus pending atau diverifikasi yang dapat dibatalkan.', 409);
        }

        $input = ValidationHelper::sanitizeAll(ValidationHelper::getInput());
        $catatan = isset($input['catatan']) ? trim($input['catatan']) : 'Dibatalkan oleh petugas';

        try {
            $db = Database::getInstance();
            $db->beginTransaction();

            // 1. Update status pencocokan -> dibatalkan
            $this->matchModel->updateStatus($id, 'dibatalkan', $catatan);

            // 2. Kembalikan status barang temuan -> tersimpan
            $barang = $this->foundItemModel->findById($match['barang_temuan_id']);
            if ($barang) {
                $this->foundItemModel->update($match['barang_temuan_id'], array_merge($barang, ['status' => 'tersimpan']));
            }

            // 3. Kembalikan status laporan kehilangan -> menunggu
            $laporan = $this->lostReportModel->findById($match['laporan_id']);
            if ($laporan) {
                $this->lostReportModel->update($match['laporan_id'], array_merge($laporan, ['status' => 'menunggu']));
            }

            $db->commit();

            $updatedMatch = $this->matchModel->findById($id);
            ResponseHelper::success(
                ['match' => $updatedMatch],
                'Pencocokan berhasil dibatalkan. Status barang dan laporan telah dikembalikan.'
            );

        } catch (\Exception $e) {
            $db->rollBack();
            ResponseHelper::error('Terjadi kesalahan saat membatalkan pencocokan: ' . $e->getMessage(), 500);
        }
    }

    private function handleHandoverPhotoUpload(array $file): string
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            ResponseHelper::validationError([
                'foto_bukti_serah' => 'Upload foto bukti handover gagal.'
            ]);
        }

        if ($file['size'] > MAX_FILE_SIZE) {
            ResponseHelper::validationError([
                'foto_bukti_serah' => 'Ukuran foto maksimal 5 MB.'
            ]);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, ALLOWED_TYPES, true)) {
            ResponseHelper::validationError([
                'foto_bukti_serah' => 'Format foto tidak didukung. Gunakan JPEG, PNG, atau WebP.'
            ]);
        }

        $handoverDir = rtrim(UPLOAD_PATH, '/\\') . DIRECTORY_SEPARATOR . 'handover' . DIRECTORY_SEPARATOR;

        if (!is_dir($handoverDir) && !mkdir($handoverDir, 0755, true)) {
            throw new \RuntimeException('Gagal membuat folder upload handover.');
        }

        if (!is_writable($handoverDir)) {
            throw new \RuntimeException('Folder upload handover tidak bisa ditulis.');
        }

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $fileName = 'handover_' . uniqid('', true) . '.' . $ext;
        $destPath = $handoverDir . $fileName;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            throw new \RuntimeException('Gagal menyimpan foto bukti handover.');
        }

        return 'uploads/handover/' . $fileName;
    }
}