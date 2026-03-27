
<?php
require_once __DIR__ . '/../config.php';

function frontend_url(string $path = ''): string
{
    $base = rtrim(FRONTEND_BASE_URL, '/');
    if ($path === '' || $path === '/') {
        return $base . '/';
    }
    return $base . '/' . ltrim($path, '/');
}

function asset_url(string $path): string
{
    return frontend_url('assets/' . ltrim($path, '/'));
}
