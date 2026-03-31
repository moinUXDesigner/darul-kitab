<?php

// ================================
// CORS HEADERS
// ================================
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// ================================
// HANDLE PREFLIGHT REQUEST
// ================================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';



$user = authGuard();
$db = (new Database())->connect();


$stmt = $db->prepare("SELECT id, sender AS `from`, subject, body FROM emails WHERE user_id=? ORDER BY id DESC");
$stmt->execute([$user->id]);


echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

?>