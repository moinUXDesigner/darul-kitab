<?php
/**
 * Razorpay Configuration
 */

require_once __DIR__ . '/env.php';

loadEnvFile(dirname(__DIR__) . '/.env');

define('RAZORPAY_KEY_ID', env('RAZORPAY_KEY_ID', ''));
define('RAZORPAY_KEY_SECRET', env('RAZORPAY_KEY_SECRET', ''));
define('RAZORPAY_WEBHOOK_SECRET', env('RAZORPAY_WEBHOOK_SECRET', ''));

/**
 * Make a Razorpay API request
 */
function razorpayRequest(string $method, string $endpoint, array $data = []): array {
    if (RAZORPAY_KEY_ID === '' || RAZORPAY_KEY_SECRET === '') {
        return [
            'error' => [
                'description' => 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in api/.env',
            ],
            'message' => 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in api/.env',
            'http_code' => 500,
            'request_failed' => true,
        ];
    }

    $url = 'https://api.razorpay.com/v1/' . ltrim($endpoint, '/');
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, RAZORPAY_KEY_ID . ':' . RAZORPAY_KEY_SECRET);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        return [
            'error' => [
                'description' => 'cURL error: ' . $error,
            ],
            'message' => 'cURL error: ' . $error,
            'http_code' => 0,
            'request_failed' => true,
        ];
    }
    
    $decoded = json_decode($response, true) ?? [];
    $decoded['http_code'] = $httpCode;
    
    if ($httpCode >= 400) {
        $decoded['request_failed'] = true;

        if (!isset($decoded['message']) || trim((string)$decoded['message']) === '') {
            $decoded['message'] = razorpayErrorMessage($decoded, 'Razorpay request failed');
        }
    }
    
    return $decoded;
}

function razorpayHasError(array $response): bool {
    if (($response['request_failed'] ?? false) === true) {
        return true;
    }

    if (!array_key_exists('error', $response)) {
        return false;
    }

    return $response['error'] !== null && $response['error'] !== false;
}

function razorpayErrorMessage(array $response, string $default = 'Razorpay request failed'): string {
    $error = $response['error'] ?? null;

    if (is_array($error)) {
        $description = trim((string)($error['description'] ?? ''));
        if ($description !== '') {
            return $description;
        }

        $reason = trim((string)($error['reason'] ?? ''));
        if ($reason !== '') {
            return $reason;
        }
    }

    $message = trim((string)($response['message'] ?? ''));
    if ($message !== '') {
        return $message;
    }

    return $default;
}

/**
 * Verify Razorpay webhook signature
 */
function verifyWebhookSignature(string $payload, string $signature): bool {
    if (RAZORPAY_WEBHOOK_SECRET === '') {
        return false;
    }

    $expected = hash_hmac('sha256', $payload, RAZORPAY_WEBHOOK_SECRET);
    return hash_equals($expected, $signature);
}
