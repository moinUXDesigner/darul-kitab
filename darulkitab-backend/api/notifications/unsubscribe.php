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

$user = authGuard();
$db = (new Database())->connect();
$input = json_decode(file_get_contents('php://input'), true);

$endpoint = trim($input['endpoint'] ?? '');

if (!$endpoint) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "endpoint is required"]));
}

$stmt = $db->prepare("DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?");
$stmt->execute([$user->id, $endpoint]);

echo json_encode(["status" => "success", "message" => "Push subscription removed"]);
