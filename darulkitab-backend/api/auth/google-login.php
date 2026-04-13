<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../lib/telemetry.php';

header('Content-Type: application/json');

function fetchGoogleIdentity(string $credential): ?array
{
    $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($credential);
    $response = false;

    if (function_exists('curl_init')) {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);
        $response = curl_exec($curl);
        curl_close($curl);
    } else {
        $response = @file_get_contents($url);
    }

    if ($response === false) {
        return null;
    }

    $decoded = json_decode($response, true);
    return is_array($decoded) ? $decoded : null;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$credential = trim((string)($data['credential'] ?? ''));

if ($credential === '') {
    http_response_code(400);
    echo json_encode([
        'message' => 'Google credential is required',
    ]);
    exit;
}

$googleUser = fetchGoogleIdentity($credential);

if (!$googleUser || empty($googleUser['email']) || ($googleUser['email_verified'] ?? 'false') !== 'true') {
    http_response_code(401);
    echo json_encode([
        'message' => 'Unable to verify your Google account',
    ]);
    exit;
}

$expectedAudience = trim((string)getenv('GOOGLE_CLIENT_ID'));
if ($expectedAudience !== '' && ($googleUser['aud'] ?? '') !== $expectedAudience) {
    http_response_code(401);
    echo json_encode([
        'message' => 'Google account audience mismatch',
    ]);
    exit;
}

$email = trim((string)$googleUser['email']);
$name = trim((string)($googleUser['name'] ?? 'Google User'));

try {
    $db = (new Database())->connect();

    $stmt = $db->prepare('SELECT id, user_name, email, user_role, is_premium FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $isNewUser = false;

    if (!$user) {
        $insert = $db->prepare('
            INSERT INTO users (user_name, email, password_hash, user_role, is_premium, phone)
            VALUES (?, ?, ?, ?, ?, ?)
        ');
        $insert->execute([$name, $email, 'GOOGLE_AUTH', 'user', 0, null]);

        $id = (int)$db->lastInsertId();
        $userRole = 'user';
        $isPremium = false;
        $isNewUser = true;
    } else {
        $id = (int)$user['id'];
        $name = (string)$user['user_name'];
        $userRole = (string)$user['user_role'];
        $isPremium = (bool)$user['is_premium'];
    }

    logAnalyticsEvent($db, [
        'user_id' => $id,
        'event_type' => $isNewUser ? 'signup' : 'login',
        'metadata' => [
            'method' => 'google',
            'is_new_user' => $isNewUser,
        ],
    ]);

    logAuditTrail($db, [
        'actor_user_id' => $id,
        'actor_role' => $userRole,
        'action' => $isNewUser ? 'google_signup' : 'google_login',
        'entity_type' => 'user',
        'entity_id' => (string)$id,
        'description' => $isNewUser ? 'New user account created via Google sign-in' : 'User signed in with Google',
        'metadata' => [
            'email' => $email,
        ],
    ]);

    $token = createToken([
        'id' => $id,
        'email' => $email,
        'user_role' => $userRole,
        'is_premium' => $isPremium,
    ]);

    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => $id,
            'user_name' => $name,
            'email' => $email,
            'user_role' => $userRole,
            'is_premium' => $isPremium,
        ],
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Google sign-in failed. Please try again.',
    ]);
}
