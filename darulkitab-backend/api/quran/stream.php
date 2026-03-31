<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/storage.php';

/* ================================
   GET AUDIO ID
================================ */

$audioId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($audioId <= 0) {
    http_response_code(400);
    exit("Invalid audio ID");
}

/* ================================
   DB FETCH
================================ */

try {
    $db = (new Database())->connect();

    $stmt = $db->prepare(
        "SELECT filepath FROM quran_audio WHERE id = ? AND is_active = 1"
    );
    $stmt->execute([$audioId]);
    $audio = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$audio) {
        http_response_code(404);
        exit("Audio not found");
    }

} catch (PDOException $e) {
    error_log("DB ERROR: " . $e->getMessage());
    http_response_code(500);
    exit("Database error");
}

/* ================================
   FILE PATH RESOLUTION (FIXED)
================================ */

$basePath = STORAGE_BASE; // must point to /storage/quran-audio

// Build path safely
$filePath = rtrim($basePath, '/') . '/' . ltrim($audio['filepath'], '/');

// Debug logs (remove later if needed)
error_log("Base Path: " . $basePath);
error_log("DB File: " . $audio['filepath']);
error_log("Final Path: " . $filePath);

/* ================================
   SECURITY + EXISTENCE CHECK
================================ */

if (!file_exists($filePath)) {
    error_log("FILE NOT FOUND: " . $filePath);
    http_response_code(404);
    exit("File missing: " . $filePath);
}

// Optional security (ensure inside storage)
if (strpos(realpath($filePath), realpath($basePath)) !== 0) {
    http_response_code(403);
    exit("Access denied: " . $filePath);
}

/* ================================
   STREAM WITH RANGE SUPPORT
================================ */

$size  = filesize($filePath);
$start = 0;
$end   = $size - 1;

// Handle Range header (for seek)
if (isset($_SERVER['HTTP_RANGE'])) {
    if (preg_match('/bytes=(\d+)-(\d+)?/', $_SERVER['HTTP_RANGE'], $matches)) {
        $start = (int)$matches[1];
        if (isset($matches[2]) && $matches[2] !== '') {
            $end = (int)$matches[2];
        }
        header("HTTP/1.1 206 Partial Content");
    }
}

$length = $end - $start + 1;

/* ================================
   HEADERS
================================ */

header("Content-Type: audio/mpeg");
header("Accept-Ranges: bytes");
header("Content-Length: " . $length);
header("Content-Range: bytes $start-$end/$size");

/* ================================
   STREAM FILE
================================ */

$fp = fopen($filePath, "rb");

if ($fp === false) {
    http_response_code(500);
    exit("Cannot open file");
}

fseek($fp, $start);

$buffer = 8192;

while (!feof($fp) && ftell($fp) <= $end) {
    echo fread($fp, min($buffer, $end - ftell($fp) + 1));
    flush();
}

fclose($fp);
exit;