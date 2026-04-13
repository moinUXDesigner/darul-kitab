<?php
/**
 * Unsubscribe from Push Notifications
 * 
 * POST /api/notifications/unsubscribe.php
 * Body: { "endpoint": "..." }
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/telemetry.php';

$user = authGuard();
$db = (new Database())->connect();
$input = json_decode(file_get_contents('php://input'), true);

$db->exec("
    CREATE TABLE IF NOT EXISTS push_subscriptions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        endpoint TEXT NOT NULL,
        p256dh VARCHAR(255) NOT NULL,
        auth VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_endpoint (user_id, endpoint(255)),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
");

$endpoint = trim($input['endpoint'] ?? '');

if (!$endpoint) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "endpoint is required"]));
}

$stmt = $db->prepare("DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?");
$stmt->execute([$user->id, $endpoint]);

logAnalyticsEvent($db, [
    'user_id' => (int)$user->id,
    'event_type' => 'push_disabled',
]);

logAuditTrail($db, [
    'actor_user_id' => (int)$user->id,
    'actor_role' => (string)($user->user_role ?? 'user'),
    'action' => 'push_disabled',
    'entity_type' => 'notification_preference',
    'entity_id' => (string)$user->id,
    'description' => 'User disabled push notifications',
]);

echo json_encode(["status" => "success", "message" => "Push subscription removed"]);
