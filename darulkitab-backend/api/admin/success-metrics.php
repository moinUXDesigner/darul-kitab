<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/telemetry.php';

$user = adminGuard();
$db = (new Database())->connect();
ensureTelemetryTables($db);

function scalar(PDO $db, string $sql, array $params = []): float
{
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    return (float)$stmt->fetchColumn();
}

function retentionRate(PDO $db, int $days): array
{
    $cohortEnd = (new DateTimeImmutable("-{$days} day"))->format('Y-m-d H:i:s');
    $cohortStart = (new DateTimeImmutable('-' . ($days + 7) . ' day'))->format('Y-m-d H:i:s');

    $cohortStmt = $db->prepare("
        SELECT id, created_at
        FROM users
        WHERE created_at >= :cohort_start
          AND created_at < :cohort_end
    ");
    $cohortStmt->bindValue(':cohort_start', $cohortStart);
    $cohortStmt->bindValue(':cohort_end', $cohortEnd);
    $cohortStmt->execute();
    $users = $cohortStmt->fetchAll(PDO::FETCH_ASSOC);

    $cohortSize = count($users);
    if ($cohortSize === 0) {
        return ['rate' => 0, 'cohort_size' => 0, 'retained_users' => 0];
    }

    $retainedUsers = 0;
    $activityStmt = $db->prepare("
        SELECT 1
        FROM analytics_events
        WHERE user_id = :user_id
          AND occurred_at >= DATE_ADD(:created_at, INTERVAL :days DAY)
        LIMIT 1
    ");

    foreach ($users as $cohortUser) {
        $activityStmt->bindValue(':user_id', (int)$cohortUser['id'], PDO::PARAM_INT);
        $activityStmt->bindValue(':created_at', $cohortUser['created_at']);
        $activityStmt->bindValue(':days', $days, PDO::PARAM_INT);
        $activityStmt->execute();
        if ($activityStmt->fetchColumn()) {
            $retainedUsers++;
        }
    }

    return [
        'rate' => round(($retainedUsers / $cohortSize) * 100, 1),
        'cohort_size' => $cohortSize,
        'retained_users' => $retainedUsers,
    ];
}

$feedbackColumns = $db->query("SHOW COLUMNS FROM feedback")->fetchAll(PDO::FETCH_COLUMN);
$feedbackHasCreatedAt = in_array('created_at', $feedbackColumns, true);
if (!$feedbackHasCreatedAt) {
    $db->exec("ALTER TABLE feedback ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP");
    $feedbackHasCreatedAt = true;
}

$dailyActiveUsers = (int)scalar($db, "
    SELECT COUNT(DISTINCT user_id)
    FROM analytics_events
    WHERE user_id IS NOT NULL
      AND DATE(occurred_at) = CURDATE()
");

$weeklyActiveUsers = (int)scalar($db, "
    SELECT COUNT(DISTINCT user_id)
    FROM analytics_events
    WHERE user_id IS NOT NULL
      AND occurred_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
");

$avgSessionMinutes = (float)scalar($db, "
    SELECT COALESCE(SUM(value_seconds) / NULLIF(COUNT(DISTINCT session_id), 0) / 60, 0)
    FROM analytics_events
    WHERE event_type IN ('playback_progress', 'track_completed')
      AND session_id IS NOT NULL
      AND occurred_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
");

$totalUsers = (int)scalar($db, "SELECT COUNT(*) FROM users");
$premiumUsers = (int)scalar($db, "SELECT COUNT(*) FROM users WHERE is_premium = 1");
$conversionOverall = $totalUsers > 0 ? round(($premiumUsers / $totalUsers) * 100, 1) : 0;

$newUsers30d = (int)scalar($db, "SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
$convertedUsers30d = (int)scalar($db, "
    SELECT COUNT(DISTINCT u.id)
    FROM users u
    INNER JOIN user_subscriptions us ON us.user_id = u.id
    WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      AND us.status IN ('active', 'cancelled', 'expired')
");
$conversion30d = $newUsers30d > 0 ? round(($convertedUsers30d / $newUsers30d) * 100, 1) : 0;

$engagedTracks30d = (int)scalar($db, "
    SELECT COUNT(DISTINCT CONCAT(COALESCE(user_id, 0), '-', COALESCE(audio_id, 0)))
    FROM analytics_events
    WHERE event_type IN ('playback_progress', 'track_completed')
      AND audio_id IS NOT NULL
      AND occurred_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
");

$completedTracks30d = (int)scalar($db, "
    SELECT COUNT(DISTINCT CONCAT(COALESCE(user_id, 0), '-', COALESCE(audio_id, 0)))
    FROM analytics_events
    WHERE event_type = 'track_completed'
      AND audio_id IS NOT NULL
      AND occurred_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
");

if ($engagedTracks30d === 0) {
    $engagedTracks30d = (int)scalar($db, "SELECT COUNT(*) FROM listening_progress WHERE position_seconds > 0");
    $completedTracks30d = (int)scalar($db, "SELECT COUNT(*) FROM listening_progress WHERE completed = 1");
}

$playbackCompletionRate = $engagedTracks30d > 0 ? round(($completedTracks30d / $engagedTracks30d) * 100, 1) : 0;

$retentionD7 = retentionRate($db, 7);
$retentionD30 = retentionRate($db, 30);

$trendStmt = $db->query("
    SELECT
        DATE(occurred_at) AS metric_date,
        COUNT(DISTINCT user_id) AS dau,
        ROUND(COALESCE(SUM(CASE WHEN event_type IN ('playback_progress', 'track_completed') THEN value_seconds ELSE 0 END) / 60, 0), 1) AS listening_minutes,
        COUNT(DISTINCT CASE WHEN event_type = 'subscription_activated' THEN user_id END) AS conversions,
        COUNT(DISTINCT CASE WHEN event_type = 'track_completed' THEN CONCAT(COALESCE(user_id, 0), '-', COALESCE(audio_id, 0)) END) AS completed_tracks,
        COUNT(DISTINCT CASE WHEN event_type IN ('playback_progress', 'track_completed') THEN CONCAT(COALESCE(user_id, 0), '-', COALESCE(audio_id, 0)) END) AS engaged_tracks
    FROM analytics_events
    WHERE occurred_at >= DATE_SUB(CURDATE(), INTERVAL 13 DAY)
    GROUP BY DATE(occurred_at)
    ORDER BY metric_date ASC
");
$trendRows = $trendStmt->fetchAll(PDO::FETCH_ASSOC);

$trendMap = [];
foreach ($trendRows as $row) {
    $engaged = (int)($row['engaged_tracks'] ?? 0);
    $completed = (int)($row['completed_tracks'] ?? 0);
    $trendMap[$row['metric_date']] = [
        'date' => $row['metric_date'],
        'daily_active_users' => (int)($row['dau'] ?? 0),
        'listening_minutes' => (float)($row['listening_minutes'] ?? 0),
        'subscription_conversions' => (int)($row['conversions'] ?? 0),
        'playback_completion_rate' => $engaged > 0 ? round(($completed / $engaged) * 100, 1) : 0,
    ];
}

$trend = [];
for ($offset = 13; $offset >= 0; $offset--) {
    $date = (new DateTimeImmutable("-{$offset} day"))->format('Y-m-d');
    $trend[] = $trendMap[$date] ?? [
        'date' => $date,
        'daily_active_users' => 0,
        'listening_minutes' => 0,
        'subscription_conversions' => 0,
        'playback_completion_rate' => 0,
    ];
}

echo json_encode([
    'status' => 'success',
    'data' => [
        'daily_active_users' => $dailyActiveUsers,
        'weekly_active_users' => $weeklyActiveUsers,
        'average_session_minutes_7d' => round($avgSessionMinutes, 1),
        'subscription_conversion_overall' => $conversionOverall,
        'subscription_conversion_30d' => $conversion30d,
        'retention_d7' => $retentionD7,
        'retention_d30' => $retentionD30,
        'playback_completion_rate_30d' => $playbackCompletionRate,
        'engaged_tracks_30d' => $engagedTracks30d,
        'completed_tracks_30d' => $completedTracks30d,
        'audit_trail_events_30d' => (int)scalar($db, "SELECT COUNT(*) FROM audit_trails WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"),
        'notifications_sent_30d' => (int)scalar($db, "SELECT COUNT(*) FROM notifications WHERE sent_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"),
        'feedback_submissions_30d' => (int)scalar($db, $feedbackHasCreatedAt
            ? "SELECT COUNT(*) FROM feedback WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
            : "SELECT COUNT(*) FROM feedback"),
        'trend' => $trend,
    ],
]);
