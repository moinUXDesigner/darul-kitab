<?php
/**
 * Admin Dashboard Stats
 * 
 * GET /api/admin/dashboard.php
 * Returns overview stats: total users, active, free, premium, expiring soon
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/razorpay.php';

$user = adminGuard();
$db = (new Database())->connect();

// Total users
$total = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();

// Premium (active) users
$premium = $db->query("SELECT COUNT(*) FROM users WHERE is_premium = 1")->fetchColumn();

// Free users
$free = $total - $premium;

// Active subscriptions
$activeSubs = $db->query("SELECT COUNT(*) FROM user_subscriptions WHERE status = 'active'")->fetchColumn();

// Subscriptions ending within 7 days
$expiringSoon = $db->query("
    SELECT COUNT(*) FROM user_subscriptions 
    WHERE status = 'active' AND end_date IS NOT NULL AND end_date <= DATE_ADD(NOW(), INTERVAL 7 DAY)
")->fetchColumn();

// Expired subscriptions
$expired = $db->query("SELECT COUNT(*) FROM user_subscriptions WHERE status = 'expired'")->fetchColumn();

// Cancelled subscriptions
$cancelled = $db->query("SELECT COUNT(*) FROM user_subscriptions WHERE status = 'cancelled'")->fetchColumn();

// Total settled revenue from Razorpay bank settlements.
$revenue = getTotalSettledRevenue();

// Users registered in last 30 days
$newUsers30d = $db->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetchColumn();

// Feedback count
$feedbackCount = $db->query("SELECT COUNT(*) FROM feedback")->fetchColumn();

echo json_encode([
    "status" => "success",
    "data" => [
        "total_users" => (int)$total,
        "premium_users" => (int)$premium,
        "free_users" => (int)$free,
        "active_subscriptions" => (int)$activeSubs,
        "expiring_soon" => (int)$expiringSoon,
        "expired_subscriptions" => (int)$expired,
        "cancelled_subscriptions" => (int)$cancelled,
        "total_revenue" => (float)$revenue,
        "new_users_30d" => (int)$newUsers30d,
        "feedback_count" => (int)$feedbackCount,
    ]
]);

function getTotalSettledRevenue(): float {
    $batchSize = 100;
    $skip = 0;
    $totalPaise = 0;
    $maxPages = 20;

    for ($page = 0; $page < $maxPages; $page++) {
        $response = razorpayRequest('GET', "settlements?count=$batchSize&skip=$skip");

        if (razorpayHasError($response)) {
            error_log('dashboard settled revenue sync failed: ' . razorpayErrorMessage($response, 'Failed to fetch Razorpay settlements'));
            return 0.0;
        }

        $items = $response['items'] ?? [];
        if (!is_array($items) || count($items) === 0) {
            break;
        }

        foreach ($items as $item) {
            if (($item['status'] ?? '') !== 'processed') {
                continue;
            }

            $totalPaise += (int)($item['amount'] ?? 0);
        }

        if (count($items) < $batchSize) {
            break;
        }

        $skip += $batchSize;
    }

    return round($totalPaise / 100, 2);
}
