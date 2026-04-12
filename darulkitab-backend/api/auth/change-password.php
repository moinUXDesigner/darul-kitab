<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/middleware.php';

header('Content-Type: application/json');

$user = authGuard();
$data = json_decode(file_get_contents('php://input'), true) ?? [];

$currentPassword = (string)($data['current_password'] ?? '');
$newPassword = (string)($data['new_password'] ?? '');
$userId = isset($user->id) ? (int)$user->id : 0;

if ($userId <= 0) {
    http_response_code(401);
    echo json_encode([
        'message' => 'Invalid user session',
    ]);
    exit;
}

if ($newPassword === '') {
    http_response_code(400);
    echo json_encode([
        'message' => 'New password is required',
    ]);
    exit;
}

if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode([
        'message' => 'Password must be at least 6 characters',
    ]);
    exit;
}

try {
    $db = (new Database())->connect();

    $stmt = $db->prepare('SELECT id, password_hash FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$existingUser) {
        http_response_code(404);
        echo json_encode([
            'message' => 'User account not found',
        ]);
        exit;
    }

    $isGoogleOnlyAccount = ($existingUser['password_hash'] ?? '') === 'GOOGLE_AUTH';

    if (!$isGoogleOnlyAccount) {
        if ($currentPassword === '') {
            http_response_code(400);
            echo json_encode([
                'message' => 'Current password is required',
            ]);
            exit;
        }

        if (!password_verify($currentPassword, (string)$existingUser['password_hash'])) {
            http_response_code(401);
            echo json_encode([
                'message' => 'Current password is incorrect',
            ]);
            exit;
        }
    }

    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);

    $update = $db->prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    $update->execute([$newHash, $userId]);

    echo json_encode([
        'message' => $isGoogleOnlyAccount
            ? 'Password created successfully for your Google account'
            : 'Password updated successfully',
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Unable to update password right now',
    ]);
}
