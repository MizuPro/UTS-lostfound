<?php
require_once __DIR__ . '/index.php';

// Mock Auth
$userModel = new UserModel();
$user = $userModel->findByEmail('petugas@commuterlink.id');
$GLOBALS['auth_user'] = [
    'user_id' => $user['id'],
    'name'    => $user['name'],
    'email'   => $user['email'],
    'role'    => $user['role'],
];

$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['CONTENT_TYPE'] = 'application/json';

// Test input for LostReport
$input = [
    'nama_barang' => 'Test Barang',
    'lokasi' => 'Stasiun Test',
    'waktu_hilang' => '2026-03-28 14:30:00',
    'deskripsi' => 'Test Deskripsi'
];
$_POST = $input; // Just in case
// Override php://input with our mock json
$GLOBALS['mock_json'] = json_encode($input);

class MockValidationHelper extends ValidationHelper {
    public static function getJsonBody(): array {
        return json_decode($GLOBALS['mock_json'], true);
    }
}
// Actually, ValidationHelper is already loaded. I can't redefine it.
// Let's just override $_POST and change content type to form-data so it reads $_POST.
$_SERVER['CONTENT_TYPE'] = 'multipart/form-data';

$controller = new LostReportController();
try {
    $controller->store();
} catch (Exception $e) {
    echo "Exception: " . $e->getMessage();
}
