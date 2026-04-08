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

try {
    $db = (new Database())->connect();

    ensureListeningProgressSchema($db);

    // Total audio tracks in system
    $totalTracks = $db->query("SELECT COUNT(*) FROM quran_audio WHERE is_active = 1")->fetchColumn();

    // User's completed tracks
    $completedTracks = $db->prepare("SELECT COUNT(*) FROM listening_progress WHERE user_id = ? AND completed = 1");
    $completedTracks->execute([$user->id]);
    $completedCount = (int)$completedTracks->fetchColumn();

    // User's in-progress tracks
    $inProgress = $db->prepare("SELECT COUNT(*) FROM listening_progress WHERE user_id = ? AND completed = 0 AND position_seconds > 0");
    $inProgress->execute([$user->id]);
    $inProgressCount = (int)$inProgress->fetchColumn();

    // Total listening time (seconds)
    $totalTime = $db->prepare("
        SELECT COALESCE(SUM(
            CASE WHEN completed = 1 THEN duration_seconds ELSE position_seconds END
        ), 0) FROM listening_progress WHERE user_id = ?
    ");
    $totalTime->execute([$user->id]);
    $totalListeningSeconds = (float)$totalTime->fetchColumn();

    // Per-surah progress
    $surahProgress = $db->prepare("
        SELECT 
            qa.surah_no,
            s.english_name,
            s.arabic_name,
            COUNT(DISTINCT qa.id) as total_tracks,
            COUNT(DISTINCT CASE WHEN lp.completed = 1 THEN lp.audio_id END) as completed_tracks,
            COUNT(DISTINCT CASE WHEN lp.completed = 0 AND lp.position_seconds > 0 THEN lp.audio_id END) as in_progress_tracks,
            COALESCE(SUM(COALESCE(qa.duration_seconds, lp.duration_seconds, 0)), 0) as total_duration_seconds,
            COALESCE(SUM(
                CASE
                    WHEN lp.completed = 1 THEN COALESCE(qa.duration_seconds, lp.duration_seconds, 0)
                    WHEN lp.position_seconds > 0 THEN LEAST(lp.position_seconds, COALESCE(qa.duration_seconds, lp.duration_seconds, lp.position_seconds, 0))
                    ELSE 0
                END
            ), 0) as listened_seconds
        FROM quran_audio qa
        JOIN surahs s ON s.id = qa.surah_no
        LEFT JOIN listening_progress lp ON lp.audio_id = qa.id AND lp.user_id = ?
        WHERE qa.is_active = 1
        GROUP BY qa.surah_no, s.english_name, s.arabic_name
        ORDER BY qa.surah_no
    ");
    $surahProgress->execute([$user->id]);
    $surahData = $surahProgress->fetchAll(PDO::FETCH_ASSOC);

    // Surahs fully completed
    $completedSurahs = 0;
    foreach ($surahData as &$s) {
        $totalDuration = (float)$s['total_duration_seconds'];
        $listenedSeconds = (float)$s['listened_seconds'];
        $s['progress_percent'] = $totalDuration > 0
            ? round(min(100, ($listenedSeconds / $totalDuration) * 100))
            : 0;

        if ((int)$s['total_tracks'] > 0 && (int)$s['completed_tracks'] === (int)$s['total_tracks']) {
            $completedSurahs++;
        }
    }
    unset($s);

    // Favorites count
    $favCount = $db->prepare("SELECT COUNT(*) FROM user_favorites WHERE user_id = ?");
    $favCount->execute([$user->id]);
    $favoritesCount = (int)$favCount->fetchColumn();

    // Overall completion percentage
    $overallPercent = $totalTracks > 0 ? round(($completedCount / $totalTracks) * 100, 1) : 0;

    // User level calculation
    $levels = [
        ['name' => 'Beginner',     'name_ar' => 'مبتدئ',    'min' => 0],
        ['name' => 'Learner',      'name_ar' => 'متعلم',    'min' => 5],
        ['name' => 'Listener',     'name_ar' => 'مستمع',    'min' => 15],
        ['name' => 'Dedicated',    'name_ar' => 'مخلص',     'min' => 30],
        ['name' => 'Hafiz-in-Training', 'name_ar' => 'طالب حفظ', 'min' => 50],
        ['name' => 'Scholar',      'name_ar' => 'عالم',     'min' => 75],
        ['name' => 'Master',       'name_ar' => 'متقن',     'min' => 100],
    ];

    $currentLevel = $levels[0];
    $nextLevel = isset($levels[1]) ? $levels[1] : null;
    foreach ($levels as $i => $level) {
        if ($overallPercent >= $level['min']) {
            $currentLevel = $level;
            $nextLevel = isset($levels[$i + 1]) ? $levels[$i + 1] : null;
        }
    }

    echo json_encode([
        "total_tracks" => (int)$totalTracks,
        "completed_tracks" => $completedCount,
        "in_progress_tracks" => $inProgressCount,
        "total_listening_seconds" => round($totalListeningSeconds),
        "total_listening_hours" => round($totalListeningSeconds / 3600, 1),
        "overall_percent" => $overallPercent,
        "completed_surahs" => $completedSurahs,
        "favorites_count" => $favoritesCount,
        "level" => $currentLevel,
        "next_level" => $nextLevel,
        "surah_progress" => $surahData,
    ]);

} catch (PDOException $e) {
    error_log("User stats error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Failed to get stats"]);
}
