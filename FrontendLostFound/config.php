
<?php

define('FRONTEND_APP_NAME', 'Finder by KAI');

$frontendBaseUrl = getenv('FRONTEND_BASE_URL');
if ($frontendBaseUrl === false || $frontendBaseUrl === '') {
	// Auto-detect app base path from current script, e.g. /lostfound
	$scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
	$detectedBase = str_replace('\\', '/', dirname($scriptName));
	$frontendBaseUrl = ($detectedBase === '.' || $detectedBase === '/') ? '' : rtrim($detectedBase, '/');
}

define('FRONTEND_BASE_URL', $frontendBaseUrl);

$frontendApiBaseUrl = getenv('FRONTEND_API_BASE_URL');
if ($frontendApiBaseUrl === false || $frontendApiBaseUrl === '') {
	$frontendRoot = str_replace('\\', '/', dirname(rtrim(FRONTEND_BASE_URL, '/')));
	$frontendRoot = ($frontendRoot === '.' || $frontendRoot === '/') ? '' : rtrim($frontendRoot, '/');
	$frontendApiBaseUrl = $frontendRoot . '/BackendLostFound';
}

define('FRONTEND_API_BASE_URL', rtrim($frontendApiBaseUrl, '/'));
