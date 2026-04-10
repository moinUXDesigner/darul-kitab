<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';

function ensurePasswordResetTable(PDO $db): void
{
    $db->exec("
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED NOT NULL,
            token_hash CHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            used_at DATETIME DEFAULT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_password_reset_token_hash (token_hash),
            KEY idx_password_reset_user_id (user_id),
            KEY idx_password_reset_expires_at (expires_at),
            CONSTRAINT fk_password_reset_user
                FOREIGN KEY (user_id) REFERENCES users(id)
                ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    ");
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$token = trim((string)($data['token'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($token === '' || $password === '') {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Token and password are required',
    ]);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Password must be at least 6 characters',
    ]);
    exit;
}

try {
    $db = (new Database())->connect();
    ensurePasswordResetTable($db);

    $tokenHash = hash('sha256', $token);
    $db->beginTransaction();

    $select = $db->prepare("
        SELECT id, user_id
        FROM password_reset_tokens
        WHERE token_hash = ?
          AND used_at IS NULL
          AND expires_at > NOW()
        LIMIT 1
        FOR UPDATE
    ");
    $select->execute([$tokenHash]);
    $resetRow = $select->fetch(PDO::FETCH_ASSOC);

    if (!$resetRow) {
        $db->rollBack();
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'This reset link is invalid or has expired',
        ]);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    $updateUser = $db->prepare("
        UPDATE users
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    $updateUser->execute([
        $passwordHash,
        (int)$resetRow['user_id'],
    ]);

    $markUsed = $db->prepare("
        UPDATE password_reset_tokens
        SET used_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ");
    $markUsed->execute([(int)$resetRow['id']]);

    $clearOthers = $db->prepare("
        DELETE FROM password_reset_tokens
        WHERE user_id = ?
          AND used_at IS NULL
    ");
    $clearOthers->execute([(int)$resetRow['user_id']]);

    $db->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Your password has been reset successfully',
    ]);
} catch (Throwable $e) {
    if (isset($db) && $db instanceof PDO && $db->inTransaction()) {
        $db->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to reset password right now',
    ]);
}
