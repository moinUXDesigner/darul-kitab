<?php
/**
 * Create Razorpay Subscription
 * 
 * POST /api/razorpay/create_subscription.php
 * Body: { "plan_id": 2 }  (2=Monthly, 3=Yearly)
 * 
 * Returns subscription_id and short_url for payment
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/razorpay.php';

$user = authGuard();
$data = json_decode(file_get_contents('php://input'), true);

$planId = (int)($data['plan_id'] ?? 0);

if (!in_array($planId, [2, 3])) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "Invalid plan. Use 2 (Monthly) or 3 (Yearly)"]));
}

$db = (new Database())->connect();

// Get Razorpay plan ID from DB
$stmt = $db->prepare("SELECT razorpay_plan_id, name, price FROM subscription_plans WHERE id = ?");
$stmt->execute([$planId]);
$plan = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$plan || empty($plan['razorpay_plan_id'])) {
    http_response_code(400);
    exit(json_encode([
        "status" => "error",
        "message" => "Plan not configured in Razorpay. Run create_plans.php first.",
    ]));
}

// Check if user already has an active subscription
$stmt = $db->prepare("
    SELECT id, razorpay_subscription_id, status 
    FROM user_subscriptions 
    WHERE user_id = ? AND status = 'active'
    ORDER BY id DESC LIMIT 1
");
$stmt->execute([$user->id]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    http_response_code(409);
    exit(json_encode([
        "status" => "error",
        "message" => "You already have an active subscription",
        "subscription_id" => $existing['razorpay_subscription_id'],
    ]));
}

// Create subscription in Razorpay
$response = razorpayRequest('POST', 'subscriptions', [
    'plan_id' => $plan['razorpay_plan_id'],
    'total_count' => $planId === 2 ? 12 : 5, // 12 months or 5 years max
    'quantity' => 1,
    'notes' => [
        'user_id' => (string)$user->id,
        'email' => $user->email,
        'plan_name' => $plan['name'],
    ],
]);

if (isset($response['error']) && $response['error'] === true) {
    http_response_code(500);
    exit(json_encode([
        "status" => "error",
        "message" => "Failed to create subscription",
        "details" => $response['error']['description'] ?? 'Unknown error',
    ]));
}

$subscriptionId = $response['id'];
$shortUrl = $response['short_url'] ?? null;

// Store subscription in DB as 'created'
$stmt = $db->prepare("
    INSERT INTO user_subscriptions (user_id, plan_id, status, razorpay_subscription_id, start_date)
    VALUES (?, ?, 'created', ?, NOW())
");
$stmt->execute([$user->id, $planId, $subscriptionId]);

// Store payment record
$stmt = $db->prepare("
    INSERT INTO payments (user_id, plan_id, gateway, gateway_subscription_id, amount, currency, status)
    VALUES (?, ?, 'razorpay', ?, ?, 'INR', 'created')
");
$stmt->execute([$user->id, $planId, $subscriptionId, $plan['price']]);

echo json_encode([
    "status" => "success",
    "subscription_id" => $subscriptionId,
    "short_url" => $shortUrl,
    "plan" => $plan['name'],
    "amount" => '₹' . $plan['price'],
    "razorpay_key" => RAZORPAY_KEY_ID,
]);
