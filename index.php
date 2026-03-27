<?php

declare(strict_types=1);

$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
$basePath = str_replace('\\', '/', dirname($scriptName));
$basePath = ($basePath === '.' || $basePath === '/') ? '' : rtrim($basePath, '/');

$target = $basePath . '/FrontendLostFound/';

header('Location: ' . $target, true, 302);
exit;

