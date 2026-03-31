<?php
$storagePath = realpath(__DIR__ . '/../../storage/quran-audio');
if (!$storagePath) {
    // Fallback for container path if host mapping is different
    $storagePath = realpath('/var/www/html/storage/quran-audio');
}
define('STORAGE_BASE', $storagePath);
