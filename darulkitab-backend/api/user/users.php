
<?php
require_once __DIR__ . '/../cors.php';

// ---------- AUTH CHECK ----------
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

// ---------- DB CONNECTION ----------
require_once __DIR__ . '/../config/database.php';

$db = new Database();        // ✅ CREATE OBJECT
$conn = $db->connect();     // ✅ GET PDO CONNECTION

// ---------- QUERY ----------
$stmt = $conn->query(
    "SELECT id, user_name, email, user_role, is_premium FROM users ORDER BY id DESC"
);

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

// ---------- RESPONSE ----------
echo json_encode([
    "status" => "success",
    "data" => $users
]);
