<?php
/**
 * Cancel Subscription
 * 
 * POST /api/razorpay/cancel_subscription.php
 * Body: { "cancel_at_cycle_end": true }  (optional, defaults to true)
 * 
 * Cancels the user's active Razorpay subscription
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/razorpay.php';

$user = authGuard();
$data = json_decode(file_get_contents('php://input'), true);

$cancelAtCycleEnd = $data['cancel_at_cycle_end'] ?? true;

$db = (new Database())->connect();

// Get active subscription
$stmt = $db->prepare("
    SELECT razorpay_subscription_id 
    FROM user_subscriptions 
    WHERE user_id = ? AND status = 'active'
    ORDER BY id DESC LIMIT 1
");
$stmt->execute([$user->id]);
$sub = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$sub || empty($sub['razorpay_subscription_id'])) {
    http_response_code(404);
    exit(json_encode(["status" => "error", "message" => "No active subscription found"]));
}

$subscriptionId = $sub['razorpay_subscription_id'];

// Cancel in Razorpay
$response = razorpayRequest('POST', "subscriptions/$subscriptionId/cancel", [
    'cancel_at_cycle_end' => $cancelAtCycleEnd ? 1 : 0,
]);

if (razorpayHasError($response)) {
    $errorMessage = razorpayErrorMessage($response, 'Failed to cancel subscription');
    http_response_code(($response['http_code'] ?? 0) >= 400 ? (int)$response['http_code'] : 500);
    exit(json_encode([
        "status" => "error",
        "message" => $errorMessage,
        "details" => $errorMessage,
    ]));
}

// Update DB
$stmt = $db->prepare("
    UPDATE user_subscriptions 
    SET status = 'cancelled' 
    WHERE razorpay_subscription_id = ?
");
$stmt->execute([$subscriptionId]);

// If immediate cancel, remove premium now
if (!$cancelAtCycleEnd) {
    $stmt = $db->prepare("UPDATE users SET is_premium = 0 WHERE id = ?");
    $stmt->execute([$user->id]);
}

echo json_encode([
    "status" => "success",
    "message" => $cancelAtCycleEnd 
        ? "Subscription will be cancelled at the end of the billing cycle" 
        : "Subscription cancelled immediately",
    "cancel_at_cycle_end" => $cancelAtCycleEnd,
]);
