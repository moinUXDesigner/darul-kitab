<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../lib/telemetry.php';

// ================================
// READ JSON INPUT
// ================================
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Email and password required"]);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid email format"]);
    exit;
}

try {
    $db = (new Database())->connect();

    // ✅ UPDATED COLUMN NAMES
    $stmt = $db->prepare("
        SELECT
            id,
            user_name,
            email,
            password_hash,
            user_role,
            is_premium
        FROM users
        WHERE email = ?
        LIMIT 1
    ");

    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(["message" => "Invalid credentials"]);
        exit;
    }

    logAnalyticsEvent($db, [
        'user_id' => (int)$user['id'],
        'event_type' => 'login',
        'metadata' => [
            'method' => 'password',
        ],
    ]);

    logAuditTrail($db, [
        'actor_user_id' => (int)$user['id'],
        'actor_role' => (string)$user['user_role'],
        'action' => 'login',
        'entity_type' => 'user',
        'entity_id' => (string)$user['id'],
        'description' => 'User signed in with email and password',
        'metadata' => [
            'email' => (string)$user['email'],
        ],
    ]);

    // ================================
    // CREATE JWT
    // ================================
    $token = createToken([
        "id" => $user['id'],
        "email" => $user['email'],
        "user_role" => $user['user_role'],
        "is_premium" => (bool)$user['is_premium']
    ]);

    // ================================
    // RESPONSE (MATCHES AuthContext)
    // ================================
    echo json_encode([
        "token" => $token,
        "user" => [
            "id" => $user['id'],
            "user_name" => $user['user_name'],
            "email" => $user['email'],
            "user_role" => $user['user_role'],
            "is_premium" => (bool)$user['is_premium']
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}
