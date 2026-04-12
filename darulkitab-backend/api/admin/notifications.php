<?php
/**
 * Admin Notifications
 * 
 * GET  /api/admin/notifications.php          — List sent notifications
 * POST /api/admin/notifications.php          — Send a push notification to all subscribers
 *   Body: { "title": "...", "body": "...", "url": "/" }
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/vapid.php';

$user = adminGuard();
$db = (new Database())->connect();

$method = $_SERVER['REQUEST_METHOD'];

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

$db->exec("
    CREATE TABLE IF NOT EXISTS notifications (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT,
        url VARCHAR(500) DEFAULT '/',
        sent_by BIGINT UNSIGNED DEFAULT NULL,
        total_sent INT DEFAULT 0,
        total_failed INT DEFAULT 0,
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sent_by) REFERENCES users(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
");

if ($method === 'GET') {
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(50, max(10, (int)($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $total = (int)$db->query("SELECT COUNT(*) FROM notifications")->fetchColumn();

    $stmt = $db->prepare("
        SELECT n.*, u.user_name AS sent_by_name
        FROM notifications n
        LEFT JOIN users u ON n.sent_by = u.id
        ORDER BY n.sent_at DESC
        LIMIT :lim OFFSET :off
    ");
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Total subscribers count
    $subCount = (int)$db->query("SELECT COUNT(*) FROM push_subscriptions")->fetchColumn();

    echo json_encode([
        "status" => "success",
        "total" => $total,
        "subscribers" => $subCount,
        "page" => $page,
        "data" => $notifications,
    ]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $title = trim($input['title'] ?? '');
    $body = trim($input['body'] ?? '');
    $url = trim($input['url'] ?? '/');

    if (!$title) {
        http_response_code(400);
        exit(json_encode(["status" => "error", "message" => "title is required"]));
    }

    // Fetch all subscriptions
    $stmt = $db->query("SELECT id, endpoint, p256dh, auth FROM push_subscriptions");
    $subscriptions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Build payload
    $payload = json_encode([
        'title' => $title,
        'body' => $body,
        'url' => $url,
    ]);

    $webpush = getWebPush();
    $sent = 0;
    $failed = 0;
    $expiredIds = [];

    if (!empty($subscriptions)) {
        foreach ($subscriptions as $sub) {
            $result = $webpush->send($sub['endpoint'], $sub['p256dh'], $sub['auth'], $payload);

            if ($result['success']) {
                $sent++;
            } else {
                $failed++;
                // Remove expired/invalid subscriptions (410 Gone or 404 Not Found)
                if (in_array($result['http_code'], [404, 410], true)) {
                    $expiredIds[] = $sub['id'];
                }
            }
        }
    }

    // Clean up expired subscriptions
    if (!empty($expiredIds)) {
        $placeholders = implode(',', array_fill(0, count($expiredIds), '?'));
        $db->prepare("DELETE FROM push_subscriptions WHERE id IN ($placeholders)")->execute($expiredIds);
    }

    // Log notification
    $stmt = $db->prepare("
        INSERT INTO notifications (title, body, url, sent_by, total_sent, total_failed)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$title, $body, $url, $user->id, $sent, $failed]);

    echo json_encode([
        "status" => "success",
        "message" => empty($subscriptions)
            ? "Notification saved. No push subscribers are enabled yet."
            : "Notification sent",
        "sent" => $sent,
        "failed" => $failed,
        "logged" => 1,
        "expired_removed" => count($expiredIds),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
