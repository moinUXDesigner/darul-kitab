<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/schema-fix.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit(json_encode(["message" => "Method not allowed"]));
}

$user = authGuard();

$surahNo = isset($_GET['surah_no']) ? (int)$_GET['surah_no'] : 0;
$audioId = isset($_GET['audio_id']) ? (int)$_GET['audio_id'] : 0;

try {
    $db = (new Database())->connect();

    ensureListeningProgressSchema($db);

    // Case 1: Get progress for a specific audio track
    if ($audioId > 0) {
        $stmt = $db->prepare("
            SELECT lp.audio_id, lp.surah_no, lp.position_seconds, lp.duration_seconds,
                   lp.completed, lp.updated_at,
                   qa.filename, qa.ayah_start, qa.ayah_end
            FROM listening_progress lp
            JOIN quran_audio qa ON qa.id = lp.audio_id
            WHERE lp.user_id = ? AND lp.audio_id = ?
        ");
        $stmt->execute([$user->id, $audioId]);
        $progress = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode($progress ?: null);
        exit;
    }

    // Case 2: Get progress for all tracks in a surah
    if ($surahNo > 0) {
        $stmt = $db->prepare("
            SELECT lp.audio_id, lp.surah_no, lp.position_seconds, lp.duration_seconds,
                   lp.completed, lp.updated_at,
                   qa.filename, qa.ayah_start, qa.ayah_end
            FROM listening_progress lp
            JOIN quran_audio qa ON qa.id = lp.audio_id
            WHERE lp.user_id = ? AND lp.surah_no = ?
            ORDER BY qa.ayah_start
        ");
        $stmt->execute([$user->id, $surahNo]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    // Case 3: Get "continue listening" — last 10 in-progress tracks
    $stmt = $db->prepare("
        SELECT lp.audio_id, lp.surah_no, lp.position_seconds, lp.duration_seconds,
               lp.completed, lp.updated_at,
               qa.filename, qa.ayah_start, qa.ayah_end, qa.reciter,
               s.arabic_name, s.english_name
        FROM listening_progress lp
        JOIN quran_audio qa ON qa.id = lp.audio_id
        JOIN surahs s ON s.id = lp.surah_no
        WHERE lp.user_id = ? AND lp.completed = 0 AND lp.position_seconds > 0
        ORDER BY lp.updated_at DESC
        LIMIT 10
    ");
    $stmt->execute([$user->id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    error_log("Get progress error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Failed to get progress"]);
}
