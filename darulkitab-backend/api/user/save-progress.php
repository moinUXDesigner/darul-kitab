<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/schema-fix.php';
require_once __DIR__ . '/../lib/telemetry.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(["message" => "Method not allowed"]));
}

$user = authGuard();
$data = json_decode(file_get_contents("php://input"), true);

$audioId         = isset($data['audio_id']) ? (int)$data['audio_id'] : 0;
$positionSeconds = isset($data['position_seconds']) ? (float)$data['position_seconds'] : 0;
$durationSeconds = isset($data['duration_seconds']) ? (float)$data['duration_seconds'] : 0;
$markComplete    = isset($data['mark_complete']) ? (bool)$data['mark_complete'] : false;
$resetProgress   = isset($data['reset']) ? (bool)$data['reset'] : false;
$sessionId       = trim((string)($data['session_id'] ?? ''));

if ($audioId <= 0) {
    http_response_code(400);
    exit(json_encode(["message" => "audio_id is required"]));
}

try {
    $db = (new Database())->connect();

    ensureListeningProgressSchema($db);

    // Verify audio exists
    $check = $db->prepare("SELECT id, surah_no FROM quran_audio WHERE id = ? AND is_active = 1");
    $check->execute([$audioId]);
    $audio = $check->fetch(PDO::FETCH_ASSOC);

    if (!$audio) {
        http_response_code(404);
        exit(json_encode(["message" => "Audio not found"]));
    }

    $existingStmt = $db->prepare("SELECT position_seconds, completed FROM listening_progress WHERE user_id = ? AND audio_id = ? LIMIT 1");
    $existingStmt->execute([$user->id, $audioId]);
    $existingProgress = $existingStmt->fetch(PDO::FETCH_ASSOC) ?: null;
    $previousPosition = isset($existingProgress['position_seconds']) ? (float)$existingProgress['position_seconds'] : 0;

    // Explicit mark-complete or reset overrides auto-detection
    if ($resetProgress) {
        $positionSeconds = 0;
        $durationSeconds = $durationSeconds ?: 0;
        $completed = 0;
    } elseif ($markComplete) {
        $completed = 1;
    } else {
        // Mark completed if position >= 95% of duration
        $completed = ($durationSeconds > 0 && $positionSeconds >= $durationSeconds * 0.95) ? 1 : 0;
    }

    // Upsert progress
    $stmt = $db->prepare("
        INSERT INTO listening_progress (user_id, audio_id, surah_no, position_seconds, duration_seconds, completed)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            position_seconds = VALUES(position_seconds),
            duration_seconds = VALUES(duration_seconds),
            completed = VALUES(completed),
            updated_at = CURRENT_TIMESTAMP
    ");

    $stmt->execute([
        $user->id,
        $audioId,
        $audio['surah_no'],
        round($positionSeconds, 2),
        round($durationSeconds, 2),
        $completed
    ]);

    $deltaSeconds = 0.0;
    if ($resetProgress) {
        $deltaSeconds = 0.0;
    } elseif ($markComplete) {
        $referenceDuration = $durationSeconds > 0 ? $durationSeconds : $previousPosition;
        $deltaSeconds = max(0, $referenceDuration - $previousPosition);
    } else {
        $deltaSeconds = max(0, $positionSeconds - $previousPosition);
    }

    logAnalyticsEvent($db, [
        'user_id' => (int)$user->id,
        'event_type' => $resetProgress ? 'playback_reset' : ($completed ? 'track_completed' : 'playback_progress'),
        'session_id' => $sessionId !== '' ? $sessionId : null,
        'audio_id' => $audioId,
        'surah_no' => (int)$audio['surah_no'],
        'value_seconds' => round($deltaSeconds, 2),
        'metadata' => [
            'position_seconds' => round($positionSeconds, 2),
            'duration_seconds' => round($durationSeconds, 2),
            'mark_complete' => $markComplete,
            'reset' => $resetProgress,
        ],
    ]);

    echo json_encode([
        "success" => true,
        "completed" => (bool)$completed
    ]);

} catch (PDOException $e) {
    error_log("Save progress error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Failed to save progress"]);
}
