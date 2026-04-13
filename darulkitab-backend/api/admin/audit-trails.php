<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../lib/telemetry.php';

$user = adminGuard();
$db = (new Database())->connect();
ensureTelemetryTables($db);

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(50, max(10, (int)($_GET['limit'] ?? 20)));
$offset = ($page - 1) * $limit;
$action = trim((string)($_GET['action'] ?? ''));
$entityType = trim((string)($_GET['entity_type'] ?? ''));
$search = trim((string)($_GET['search'] ?? ''));

$where = [];
$params = [];

if ($action !== '') {
    $where[] = 'a.action = :action';
    $params[':action'] = $action;
}

if ($entityType !== '') {
    $where[] = 'a.entity_type = :entity_type';
    $params[':entity_type'] = $entityType;
}

if ($search !== '') {
    $where[] = '(a.description LIKE :search OR a.entity_id LIKE :search OR u.user_name LIKE :search OR u.email LIKE :search)';
    $params[':search'] = '%' . $search . '%';
}

$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$countStmt = $db->prepare("
    SELECT COUNT(*)
    FROM audit_trails a
    LEFT JOIN users u ON u.id = a.actor_user_id
    $whereSql
");
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

$stmt = $db->prepare("
    SELECT
        a.*,
        u.user_name AS actor_name,
        u.email AS actor_email
    FROM audit_trails a
    LEFT JOIN users u ON u.id = a.actor_user_id
    $whereSql
    ORDER BY a.created_at DESC
    LIMIT :limit OFFSET :offset
");

foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$rows = array_map(static function (array $row): array {
    $row['metadata'] = isset($row['metadata']) && $row['metadata'] !== null
        ? (json_decode((string)$row['metadata'], true) ?: null)
        : null;
    return $row;
}, $stmt->fetchAll(PDO::FETCH_ASSOC));

echo json_encode([
    'status' => 'success',
    'page' => $page,
    'limit' => $limit,
    'total' => $total,
    'data' => $rows,
]);
