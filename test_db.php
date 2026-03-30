<?php
require_once __DIR__ . '/BackendLostFound/config/Database.php';
$db = Database::getInstance();
$stmt = $db->query("SHOW COLUMNS FROM laporan_kehilangan");
$cols = $stmt->fetchAll();
foreach ($cols as $col) {
    echo $col['Field'] . "\n";
}
