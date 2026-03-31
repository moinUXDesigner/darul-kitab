<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/jwt.php';

$data = json_decode(file_get_contents("php://input"), true);


$userName = trim($data['user_name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$phone    = $data['phone'] ?? null;

/* ---------------- VALIDATION ---------------- */

if ($userName === '' || $email === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid email format"
    ]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Password must be at least 6 characters"
    ]);
    exit;
}

/* ---------------- DATABASE ---------------- */

try {
    $db = (new Database())->connect();

    // Check email uniqueness
    $check = $db->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);

    if ($check->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "status" => "error",
            "message" => "Email already exists"
        ]);
        exit;
    }

    // Insert user
    $stmt = $db->prepare("
        INSERT INTO users (
            email,
            password_hash,
            user_role,
            is_premium,
            user_name,
            phone
        ) VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $email,
        password_hash($password, PASSWORD_BCRYPT),
        'user',
        0,
        $userName,
        $phone
    ]);

    $userId = $db->lastInsertId();

    // Create JWT
    $token = createToken([
        "id" => $userId,
        "email" => $email,
        "user_role" => "user",
        "is_premium" => false
    ]);

    echo json_encode([
        "status" => "success",
        "token" => $token,
        "user" => [
            "id" => $userId,
            "user_name" => $userName,
            "email" => $email,
            "user_role" => "user",
            "is_premium" => false
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

