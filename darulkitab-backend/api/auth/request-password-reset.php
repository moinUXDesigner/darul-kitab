<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../mail/password_reset.php';

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
$email = strtolower(trim((string)($data['email'] ?? '')));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please enter a valid email address',
    ]);
    exit;
}

$genericMessage = 'If an account exists for that email, a password reset link has been sent.';

try {
    $db = (new Database())->connect();
    ensurePasswordResetTable($db);

    $stmt = $db->prepare("
        SELECT id, user_name, email
        FROM users
        WHERE email = ?
        LIMIT 1
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $deleteExisting = $db->prepare("
            DELETE FROM password_reset_tokens
            WHERE user_id = ?
        ");
        $deleteExisting->execute([(int)$user['id']]);

        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $expiresAt = (new DateTimeImmutable('+' . passwordResetTtlMinutes() . ' minutes'))
            ->format('Y-m-d H:i:s');

        $insert = $db->prepare("
            INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
            VALUES (?, ?, ?)
        ");
        $insert->execute([
            (int)$user['id'],
            $tokenHash,
            $expiresAt,
        ]);

        $mailError = null;
        if (!sendPasswordResetEmail($user['email'], (string)$user['user_name'], $token, $mailError)) {
            error_log('Password reset email failed for user ID ' . $user['id'] . ': ' . ($mailError ?? 'unknown error'));
        }
    }

    echo json_encode([
        'status' => 'success',
        'message' => $genericMessage,
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Unable to process password reset right now',
    ]);
}
