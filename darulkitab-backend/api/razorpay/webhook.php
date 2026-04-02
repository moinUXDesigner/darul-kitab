<?php
/**
 * Razorpay Webhook Handler
 * 
 * POST /api/razorpay/webhook.php
 * 
 * Handles Razorpay subscription events:
 * - subscription.activated → Mark user as premium
 * - subscription.charged → Record payment
 * - subscription.cancelled → Remove premium access
 * - subscription.completed → Remove premium access
 * 
 * IMPORTANT: Set the webhook secret in Razorpay Dashboard:
 * Dashboard → Settings → Webhooks → Add webhook URL:
 * https://www.quranfahmi.com/api/razorpay/webhook.php (or .in)
 * Secret: darulkitab_webhook_secret_2026
 */

// No CORS or auth needed - this is called by Razorpay servers
header("Content-Type: application/json");

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/razorpay.php';

// Get raw payload
$payload = file_get_contents('php://input');

if (empty($payload)) {
    http_response_code(400);
    exit(json_encode(["status" => "error", "message" => "Empty payload"]));
}

// Verify webhook signature
$signature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '';

if (empty($signature) || !verifyWebhookSignature($payload, $signature)) {
    http_response_code(401);
    exit(json_encode(["status" => "error", "message" => "Invalid signature"]));
}

$event = json_decode($payload, true);
$eventType = $event['event'] ?? '';

// Log webhook for debugging (optional, remove in production)
error_log("Razorpay Webhook: $eventType - " . substr($payload, 0, 500));

$db = (new Database())->connect();

switch ($eventType) {
    case 'subscription.activated':
        handleSubscriptionActivated($db, $event);
        break;
    
    case 'subscription.charged':
        handleSubscriptionCharged($db, $event);
        break;
    
    case 'subscription.cancelled':
    case 'subscription.completed':
        handleSubscriptionEnded($db, $event, $eventType);
        break;
    
    default:
        // Acknowledge but don't process
        echo json_encode(["status" => "ok", "message" => "Event type not handled: $eventType"]);
        exit;
}

/* ============================================================
   HANDLER FUNCTIONS
============================================================ */

function handleSubscriptionActivated(PDO $db, array $event): void {
    $subscription = $event['payload']['subscription']['entity'] ?? [];
    $subscriptionId = $subscription['id'] ?? '';
    $notes = $subscription['notes'] ?? [];
    $userId = $notes['user_id'] ?? null;
    $planId = $subscription['plan_id'] ?? '';

    if (!$userId || !$subscriptionId) {
        http_response_code(400);
        exit(json_encode(["status" => "error", "message" => "Missing user_id or subscription_id"]));
    }

    // Get plan duration
    $planDays = getPlanDays($db, $planId);

    // Update user to premium
    $stmt = $db->prepare("UPDATE users SET is_premium = 1 WHERE id = ?");
    $stmt->execute([$userId]);

    // Update subscription status
    $stmt = $db->prepare("
        UPDATE user_subscriptions 
        SET status = 'active', start_date = NOW(), end_date = DATE_ADD(NOW(), INTERVAL ? DAY)
        WHERE razorpay_subscription_id = ?
    ");
    $stmt->execute([$planDays, $subscriptionId]);

    echo json_encode(["status" => "ok", "message" => "Subscription activated for user $userId"]);
}

function handleSubscriptionCharged(PDO $db, array $event): void {
    $payment = $event['payload']['payment']['entity'] ?? [];
    $subscription = $event['payload']['subscription']['entity'] ?? [];
    $subscriptionId = $subscription['id'] ?? '';
    $notes = $subscription['notes'] ?? $payment['notes'] ?? [];
    $userId = $notes['user_id'] ?? null;
    $paymentId = $payment['id'] ?? '';
    $amount = ($payment['amount'] ?? 0) / 100; // Convert paise to rupees

    if (!$userId || !$subscriptionId) {
        echo json_encode(["status" => "ok", "message" => "Charged but missing user context"]);
        exit;
    }

    // Ensure user stays premium
    $stmt = $db->prepare("UPDATE users SET is_premium = 1 WHERE id = ?");
    $stmt->execute([$userId]);

    // Update payment record
    $stmt = $db->prepare("
        UPDATE payments 
        SET gateway_payment_id = ?, status = 'paid', amount = ?
        WHERE gateway_subscription_id = ? AND user_id = ?
        ORDER BY id DESC LIMIT 1
    ");
    $stmt->execute([$paymentId, $amount, $subscriptionId, $userId]);

    // If no existing payment row was updated, insert a new one
    if ($stmt->rowCount() === 0) {
        $stmt = $db->prepare("
            INSERT INTO payments (user_id, gateway, gateway_payment_id, gateway_subscription_id, amount, currency, status)
            VALUES (?, 'razorpay', ?, ?, ?, 'INR', 'paid')
        ");
        $stmt->execute([$userId, $paymentId, $subscriptionId, $amount]);
    }

    echo json_encode(["status" => "ok", "message" => "Payment recorded for user $userId"]);
}

function handleSubscriptionEnded(PDO $db, array $event, string $eventType): void {
    $subscription = $event['payload']['subscription']['entity'] ?? [];
    $subscriptionId = $subscription['id'] ?? '';
    $notes = $subscription['notes'] ?? [];
    $userId = $notes['user_id'] ?? null;

    if (!$userId || !$subscriptionId) {
        echo json_encode(["status" => "ok", "message" => "Ended but missing user context"]);
        exit;
    }

    $status = ($eventType === 'subscription.cancelled') ? 'cancelled' : 'expired';

    // Remove premium
    $stmt = $db->prepare("UPDATE users SET is_premium = 0 WHERE id = ?");
    $stmt->execute([$userId]);

    // Update subscription status
    $stmt = $db->prepare("
        UPDATE user_subscriptions 
        SET status = ? 
        WHERE razorpay_subscription_id = ?
    ");
    $stmt->execute([$status, $subscriptionId]);

    echo json_encode(["status" => "ok", "message" => "Subscription $status for user $userId"]);
}

/* ============================================================
   HELPERS
============================================================ */

function getPlanDays(PDO $db, string $razorpayPlanId): int {
    $stmt = $db->prepare("SELECT duration_days FROM subscription_plans WHERE razorpay_plan_id = ?");
    $stmt->execute([$razorpayPlanId]);
    $plan = $stmt->fetch(PDO::FETCH_ASSOC);
    return $plan ? (int)$plan['duration_days'] : 30; // Default 30 days
}
