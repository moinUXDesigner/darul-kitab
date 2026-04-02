<?php
/**
 * Get Subscription Status
 * 
 * GET /api/razorpay/subscription_status.php
 * 
 * Returns the user's current subscription status and premium info
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';

$user = authGuard();
$db = (new Database())->connect();

// Get user's premium status
$stmt = $db->prepare("SELECT is_premium FROM users WHERE id = ?");
$stmt->execute([$user->id]);
$userRow = $stmt->fetch(PDO::FETCH_ASSOC);

$isPremium = (bool)($userRow['is_premium'] ?? false);

// Get active/latest subscription
$stmt = $db->prepare("
    SELECT 
        us.id,
        us.plan_id,
        us.status,
        us.razorpay_subscription_id,
        us.start_date,
        us.end_date,
        sp.name AS plan_name,
        sp.price,
        sp.duration_days
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = ?
    ORDER BY us.id DESC
    LIMIT 1
");
$stmt->execute([$user->id]);
$subscription = $stmt->fetch(PDO::FETCH_ASSOC);

// Get recent payments
$stmt = $db->prepare("
    SELECT 
        gateway_payment_id,
        amount,
        currency,
        status,
        created_at
    FROM payments
    WHERE user_id = ? AND status = 'paid'
    ORDER BY id DESC
    LIMIT 5
");
$stmt->execute([$user->id]);
$payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "status" => "success",
    "is_premium" => $isPremium,
    "subscription" => $subscription ?: null,
    "recent_payments" => $payments,
]);
