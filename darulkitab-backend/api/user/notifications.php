<?php
/**
 * User Notifications
 *
 * GET  /api/user/notifications.php?page=1&limit=20
 * GET  /api/user/notifications.php?summary=1
 * POST /api/user/notifications.php
 * Body: { "notification_id": 1 } or { "mark_all_read": true }
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';

$user = authGuard();
$db = (new Database())->connect();
$userId = (int)($user->id ?? 0);

if ($userId <= 0) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid authenticated user",
    ]);
    exit;
}

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

$db->exec("
    CREATE TABLE IF NOT EXISTS user_notification_reads (
        user_id BIGINT(20) UNSIGNED NOT NULL,
        notification_id BIGINT(20) NOT NULL,
        is_read TINYINT(1) NOT NULL DEFAULT 1,
        read_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, notification_id),
        KEY idx_notification_id (notification_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
");

function fetchUnreadCount(PDO $db, int $userId): int {
    $stmt = $db->prepare("
        SELECT COUNT(*)
        FROM notifications n
        LEFT JOIN user_notification_reads r
            ON r.notification_id = n.id
           AND r.user_id = :user_id
           AND r.is_read = 1
        WHERE r.notification_id IS NULL
    ");
    $stmt->execute([':user_id' => $userId]);
    return (int)$stmt->fetchColumn();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $summaryOnly = isset($_GET['summary']) && (string)$_GET['summary'] === '1';
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(50, max(10, (int)($_GET['limit'] ?? 20)));
    $offset = ($page - 1) * $limit;

    $unreadCount = fetchUnreadCount($db, $userId);

    if ($summaryOnly) {
        echo json_encode([
            "status" => "success",
            "unread_count" => $unreadCount,
        ]);
        exit;
    }

    $total = (int)$db->query("SELECT COUNT(*) FROM notifications")->fetchColumn();

    $stmt = $db->prepare("
        SELECT
            n.id,
            n.title,
            n.body,
            n.url,
            n.sent_at,
            CASE WHEN r.notification_id IS NULL THEN 0 ELSE 1 END AS is_read
        FROM notifications n
        LEFT JOIN user_notification_reads r
            ON r.notification_id = n.id
           AND r.user_id = :user_id
           AND r.is_read = 1
        ORDER BY n.sent_at DESC
        LIMIT :lim OFFSET :off
    ");
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':off', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "total" => $total,
        "page" => $page,
        "limit" => $limit,
        "unread_count" => $unreadCount,
        "data" => $notifications,
    ]);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $notificationId = (int)($input['notification_id'] ?? 0);
    $markAllRead = !empty($input['mark_all_read']);

    if (!$markAllRead && $notificationId <= 0) {
      http_response_code(400);
      echo json_encode([
          "status" => "error",
          "message" => "notification_id or mark_all_read is required",
      ]);
      exit;
    }

    if ($markAllRead) {
        $stmt = $db->prepare("
            INSERT INTO user_notification_reads (user_id, notification_id, is_read, read_at)
            SELECT :user_id, n.id, 1, NOW()
            FROM notifications n
            ON DUPLICATE KEY UPDATE
                is_read = VALUES(is_read),
                read_at = VALUES(read_at)
        ");
        $stmt->execute([':user_id' => $userId]);
    } else {
        $stmt = $db->prepare("
            INSERT INTO user_notification_reads (user_id, notification_id, is_read, read_at)
            VALUES (:user_id, :notification_id, 1, NOW())
            ON DUPLICATE KEY UPDATE
                is_read = VALUES(is_read),
                read_at = VALUES(read_at)
        ");
        $stmt->execute([
            ':user_id' => $userId,
            ':notification_id' => $notificationId,
        ]);
    }

    echo json_encode([
        "status" => "success",
        "message" => "Notifications updated",
        "unread_count" => fetchUnreadCount($db, $userId),
    ]);
    exit;
}

http_response_code(405);
echo json_encode([
    "status" => "error",
    "message" => "Method not allowed",
]);
