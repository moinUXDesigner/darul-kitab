<?php
/**
 * Admin Users List
 * 
 * GET /api/admin/users.php?filter=all|active|free|expiring|expired
 * 
 * Filters:
 *   all       — All users (default)
 *   active    — Users with is_premium = 1
 *   free      — Users with is_premium = 0
 *   expiring  — Users whose subscription ends within N days (?days=7 default)
 *   expired   — Users whose subscription has expired
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';

$user = adminGuard();
$db = (new Database())->connect();

$filter = $_GET['filter'] ?? 'all';
$days = max(1, (int)($_GET['days'] ?? 7));
$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(100, max(10, (int)($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

$params = [];
$where = '';
$join = '';

switch ($filter) {
    case 'active':
        $where = 'WHERE u.is_premium = 1';
        break;
    case 'free':
        $where = 'WHERE u.is_premium = 0';
        break;
    case 'expiring':
        $join = 'INNER JOIN user_subscriptions us ON u.id = us.user_id AND us.status = \'active\'';
        $where = 'WHERE us.end_date IS NOT NULL AND us.end_date <= DATE_ADD(NOW(), INTERVAL :days DAY) AND us.end_date >= NOW()';
        $params[':days'] = $days;
        break;
    case 'expired':
        $join = 'INNER JOIN user_subscriptions us ON u.id = us.user_id';
        $where = 'WHERE us.status = \'expired\' OR (us.end_date IS NOT NULL AND us.end_date < NOW())';
        break;
    default:
        // all — no filter
        break;
}

// Count query
$countSql = "SELECT COUNT(DISTINCT u.id) FROM users u $join $where";
$countStmt = $db->prepare($countSql);
$countStmt->execute($params);
$totalCount = (int)$countStmt->fetchColumn();

// Data query
$sql = "
    SELECT DISTINCT
        u.id, u.user_name, u.email, u.phone, u.user_role, u.is_premium, u.created_at,
        (SELECT us2.status FROM user_subscriptions us2 WHERE us2.user_id = u.id ORDER BY us2.id DESC LIMIT 1) AS sub_status,
        (SELECT us2.end_date FROM user_subscriptions us2 WHERE us2.user_id = u.id ORDER BY us2.id DESC LIMIT 1) AS sub_end_date,
        (SELECT sp.name FROM user_subscriptions us2 JOIN subscription_plans sp ON us2.plan_id = sp.id WHERE us2.user_id = u.id ORDER BY us2.id DESC LIMIT 1) AS plan_name
    FROM users u
    $join
    $where
    ORDER BY u.created_at DESC
    LIMIT $limit OFFSET $offset
";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "filter" => $filter,
    "total" => $totalCount,
    "page" => $page,
    "limit" => $limit,
    "data" => $users,
]);
