<?php
/**
 * Verify Subscription Status (Backend)
 * 
 * POST /api/razorpay/verify_subscription.php
 * Body: { "razorpay_subscription_id": "sub_xxx", "razorpay_payment_id": "pay_xxx" }
 * 
 * Verifies subscription with Razorpay API and syncs DB
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/razorpay.php';
require_once __DIR__ . '/../lib/telemetry.php';

$user = authGuard();
$data = json_decode(file_get_contents('php://input'), true);

$subscriptionId = trim($data['razorpay_subscription_id'] ?? '');
$paymentId = trim($data['razorpay_payment_id'] ?? '');

if (empty($subscriptionId)) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "subscription_id is required"]));
}

// Fetch subscription from Razorpay
$response = razorpayRequest('GET', "subscriptions/$subscriptionId");

if (razorpayHasError($response)) {
    http_response_code(($response['http_code'] ?? 0) >= 400 ? (int)$response['http_code'] : 500);
    exit(json_encode([
        "status" => "error",
        "message" => razorpayErrorMessage($response, 'Could not verify subscription with Razorpay'),
    ]));
}

$razorpayStatus = $response['status'] ?? 'unknown';
$db = (new Database())->connect();

if ($razorpayStatus === 'active') {
    // Activate premium
    $stmt = $db->prepare("UPDATE users SET is_premium = 1 WHERE id = ?");
    $stmt->execute([$user->id]);

    // Update subscription
    $stmt = $db->prepare("
        UPDATE user_subscriptions 
        SET status = 'active'
        WHERE razorpay_subscription_id = ? AND user_id = ?
    ");
    $stmt->execute([$subscriptionId, $user->id]);

    // Update payment if payment ID provided
    if (!empty($paymentId)) {
        $stmt = $db->prepare("
            UPDATE payments 
            SET gateway_payment_id = ?, status = 'paid'
            WHERE gateway_subscription_id = ? AND user_id = ?
            ORDER BY id DESC LIMIT 1
        ");
        $stmt->execute([$paymentId, $subscriptionId, $user->id]);
    }

    logAnalyticsEvent($db, [
        'user_id' => (int)$user->id,
        'event_type' => 'subscription_activated',
        'metadata' => [
            'subscription_id' => $subscriptionId,
            'payment_id' => $paymentId,
        ],
    ]);

    logAuditTrail($db, [
        'actor_user_id' => (int)$user->id,
        'actor_role' => (string)($user->user_role ?? 'user'),
        'action' => 'subscription_activated',
        'entity_type' => 'subscription',
        'entity_id' => $subscriptionId,
        'description' => 'Subscription verified and activated',
        'metadata' => [
            'payment_id' => $paymentId,
        ],
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Subscription verified and activated",
        "is_premium" => true,
        "razorpay_status" => $razorpayStatus,
    ]);
} else {
    echo json_encode([
        "status" => "success",
        "message" => "Subscription status: $razorpayStatus",
        "is_premium" => false,
        "razorpay_status" => $razorpayStatus,
    ]);
}
