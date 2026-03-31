<?php
require_once __DIR__ . '/../cors.php';
// require_once __DIR__ . "/../config/database.php";

// $audioId = (int)($_GET['id'] ?? 0);

// $stmt = $pdo->prepare("SELECT filepath FROM quran_audio WHERE id = ?");
// $stmt->execute([$audioId]);
// $audio = $stmt->fetch();

// if (!$audio) {
//   http_response_code(404);
//   exit("Audio not found");
// }

// $basePath = __DIR__ . "/../documents/storage/";
// $file = realpath($basePath . $audio['filepath']);

// if (!$file || !file_exists($file)) {
//   http_response_code(404);
//   exit("File missing");
// }

// $size = filesize($file);
// $start = 0;
// $end = $size - 1;

// if (isset($_SERVER['HTTP_RANGE'])) {
//   preg_match('/bytes=(\d+)-(\d+)?/', $_SERVER['HTTP_RANGE'], $matches);
//   $start = intval($matches[1]);
//   if (isset($matches[2])) $end = intval($matches[2]);
//   header("HTTP/1.1 206 Partial Content");
// }

// header("Content-Type: audio/mpeg");
// header("Accept-Ranges: bytes");
// header("Content-Length: " . ($end - $start + 1));
// header("Content-Range: bytes $start-$end/$size");

// $fp = fopen($file, "rb");
// fseek($fp, $start);

// while (!feof($fp) && ftell($fp) <= $end) {
//   echo fread($fp, 8192);
//   flush();
// }
// fclose($fp);

require_once __DIR__ . "/../config/database.php";

/* ================================
   GET AUDIO ID
================================ */

$audioId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($audioId <= 0) {
    http_response_code(400);
    exit("Invalid audio ID");
}

/* ================================
   DB CONNECTION
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
    http_response_code(500);
    exit("Database error");
}

/* ================================
   FILE RESOLUTION
================================ */


require_once __DIR__ . '/../config/storage.php';
$basePath = STORAGE_BASE;
$filePath = realpath($basePath . "/" . $audio['filepath']);

/* SECURITY CHECK */
if (
    !$filePath ||
    strpos($filePath, $basePath) !== 0 ||
    !file_exists($filePath)
) {
    error_log("File not found: $filePath");
    http_response_code(404);
    exit("File missing");
}

/* ================================
   STREAM WITH RANGE SUPPORT
================================ */

$size  = filesize($filePath);
$start = 0;
$end   = $size - 1;

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

header("Content-Type: audio/mpeg");
header("Accept-Ranges: bytes");
header("Content-Length: $length");
header("Content-Range: bytes $start-$end/$size");

$fp = fopen($filePath, "rb");
fseek($fp, $start);

$buffer = 8192;
while (!feof($fp) && ftell($fp) <= $end) {
    echo fread($fp, min($buffer, $end - ftell($fp) + 1));
    flush();
}

fclose($fp);
exit;
