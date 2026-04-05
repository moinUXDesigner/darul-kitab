<?php
/**
 * Admin Feedback List
 * 
 * GET /api/admin/feedback.php?page=1&limit=50
 * Returns all user feedback with pagination
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';

$user = adminGuard();
$db = (new Database())->connect();

$page = max(1, (int)($_GET['page'] ?? 1));
$limit = min(100, max(10, (int)($_GET['limit'] ?? 50)));
$offset = ($page - 1) * $limit;

$total = (int)$db->query("SELECT COUNT(*) FROM feedback")->fetchColumn();

$stmt = $db->prepare("SELECT name, email, mobile, query FROM feedback LIMIT :lim OFFSET :off");
$stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
$stmt->bindValue(':off', $offset, PDO::PARAM_INT);
$stmt->execute();
$feedback = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "total" => $total,
    "page" => $page,
    "limit" => $limit,
    "data" => $feedback,
]);
