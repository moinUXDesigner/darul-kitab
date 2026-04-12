<?php
/**
 * User Feedback Submission
 * 
 * POST /api/user/feedback.php
 * Body: { "query": "..." }
 * Name, email, mobile are auto-filled from the authenticated user.
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

$user = authGuard();
$db = (new Database())->connect();

$data = json_decode(file_get_contents('php://input'), true);
$query = trim($data['query'] ?? '');

if (empty($query)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Feedback message is required"]);
    exit;
}

if (mb_strlen($query) > 2000) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Feedback must be under 2000 characters"]);
    exit;
}

$userId = (int)($user->id ?? 0);
$name = trim((string)($user->user_name ?? ''));
$email = trim((string)($user->email ?? ''));
$mobile = preg_replace('/\D+/', '', (string)($user->mobile ?? $user->phone ?? ''));

if ($userId > 0) {
    $userStmt = $db->prepare("SELECT user_name, email, phone FROM users WHERE id = :id LIMIT 1");
    $userStmt->execute([':id' => $userId]);
    $dbUser = $userStmt->fetch(PDO::FETCH_ASSOC);

    if ($dbUser) {
        $name = trim((string)($dbUser['user_name'] ?? $name));
        $email = trim((string)($dbUser['email'] ?? $email));
        $mobile = preg_replace('/\D+/', '', (string)($dbUser['phone'] ?? $mobile));
    }
}

$mobile = mb_substr($mobile, 0, 10);

if ($name === '' || $email === '') {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Authenticated user details are incomplete",
    ]);
    exit;
}

try {
    $stmt = $db->prepare("INSERT INTO feedback (name, email, mobile, query) VALUES (:name, :email, :mobile, :query)");
    $stmt->execute([
        ':name'   => $name,
        ':email'  => $email,
        ':mobile' => $mobile,
        ':query'  => $query,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to save feedback",
    ]);
    exit;
}

echo json_encode(["status" => "success", "message" => "Feedback submitted successfully"]);
