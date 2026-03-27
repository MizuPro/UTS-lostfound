<?php
require_once __DIR__ . '/../includes/url.php';
$pageTitle = $pageTitle ?? FRONTEND_APP_NAME;
$pageClass = $pageClass ?? '';
$activePage = $activePage ?? '';
$isAuthPage = $isAuthPage ?? false;
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    <meta name="theme-color" content="#17171a">
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?= htmlspecialchars(asset_url('css/style.css')) ?>">
    <script>
        window.APP_CONFIG = {
            APP_NAME: <?= json_encode(FRONTEND_APP_NAME) ?>,
            FRONTEND_BASE_URL: <?= json_encode(FRONTEND_BASE_URL) ?>,
            API_BASE_URL: <?= json_encode(FRONTEND_API_BASE_URL) ?>,
            ACTIVE_PAGE: <?= json_encode($activePage) ?>,
            IS_AUTH_PAGE: <?= json_encode($isAuthPage) ?>
        };
    </script>
</head>
<body class="<?= htmlspecialchars($pageClass) ?>">
<div id="toast-container" class="toast-container"></div>
