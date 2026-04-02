<?php
/**
 * Razorpay Configuration
 * 
 * Test keys are used here. Replace with live keys for production.
 * TODO: Move to environment variables for production security.
 */

define('RAZORPAY_KEY_ID', 'rzp_test_SYQzC3W5SUr80T');
define('RAZORPAY_KEY_SECRET', 'DK1J5U95UdkiDPpNaMVM3uDR');
define('RAZORPAY_WEBHOOK_SECRET', 'darulkitab_webhook_secret_2026'); // Set this in Razorpay Dashboard too

/**
 * Make a Razorpay API request
 */
function razorpayRequest(string $method, string $endpoint, array $data = []): array {
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
        return ['error' => true, 'message' => 'cURL error: ' . $error, 'http_code' => 0];
    }
    
    $decoded = json_decode($response, true) ?? [];
    $decoded['http_code'] = $httpCode;
    
    if ($httpCode >= 400) {
        $decoded['error'] = true;
    }
    
    return $decoded;
}

/**
 * Verify Razorpay webhook signature
 */
function verifyWebhookSignature(string $payload, string $signature): bool {
    $expected = hash_hmac('sha256', $payload, RAZORPAY_WEBHOOK_SECRET);
    return hash_equals($expected, $signature);
}
