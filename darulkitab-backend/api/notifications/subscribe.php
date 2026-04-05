<?php
/**
 * Subscribe to Push Notifications
 * 
 * POST /api/notifications/subscribe.php
 * Body: { "endpoint": "...", "p256dh": "...", "auth": "..." }
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';

$user = authGuard();
$db = (new Database())->connect();
$input = json_decode(file_get_contents('php://input'), true);

$endpoint = trim($input['endpoint'] ?? '');
$p256dh = trim($input['p256dh'] ?? '');
$auth = trim($input['auth'] ?? '');

if (!$endpoint || !$p256dh || !$auth) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "endpoint, p256dh and auth are required"]));
}

// Upsert: insert or update if endpoint already exists for this user
$stmt = $db->prepare("
    INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE p256dh = VALUES(p256dh), auth = VALUES(auth), created_at = CURRENT_TIMESTAMP
");
$stmt->execute([$user->id, $endpoint, $p256dh, $auth]);

echo json_encode(["status" => "success", "message" => "Push subscription saved"]);
