<?php
require_once __DIR__ . '/../cors.php';

require_once __DIR__ . "/../config/database.php";

$surahNo = (int)($_GET['surah_no'] ?? 0);

if ($surahNo <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid surah number"]);
    exit;
}

try {
    $db = (new Database())->connect();

    $stmt = $db->prepare("
        SELECT
            id,
            surah_no,
            ayah_start,
            ayah_end,
            reciter,
            duration_seconds
        FROM quran_audio
        WHERE surah_no = ?
          AND is_active = 1
        ORDER BY ayah_start
    ");

    $stmt->execute([$surahNo]);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Failed to load surah audio"
    ]);
}
