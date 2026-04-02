<?php
/**
 * Create Razorpay Subscription Plans
 * 
 * POST /api/razorpay/create_plans.php
 * 
 * This is an ADMIN-ONLY endpoint. Run once to create plans in Razorpay.
 * After running, save the returned plan_ids to the subscription_plans table.
 * 
 * Requires: JWT with user_role = 'admin'
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/razorpay.php';

// Auth check - admin only
$user = authGuard();
if ($user->user_role !== 'admin') {
    http_response_code(403);
    exit(json_encode(["status" => "error", "message" => "Admin access required"]));
}

$db = (new Database())->connect();

$plans = [
    [
        'name' => 'Monthly Premium',
        'period' => 'monthly',
        'interval' => 1,
        'amount' => 19900, // ₹199 in paise
        'currency' => 'INR',
        'db_plan_id' => 2, // Maps to subscription_plans.id = 2 (Monthly)
    ],
    [
        'name' => 'Yearly Premium',
        'period' => 'yearly',
        'interval' => 1,
        'amount' => 199900, // ₹1999 in paise
        'currency' => 'INR',
        'db_plan_id' => 3, // Maps to subscription_plans.id = 3 (Yearly)
    ],
];

$results = [];

foreach ($plans as $plan) {
    // Create plan in Razorpay
    $response = razorpayRequest('POST', 'plans', [
        'period' => $plan['period'],
        'interval' => $plan['interval'],
        'item' => [
            'name' => $plan['name'],
            'amount' => $plan['amount'],
            'currency' => $plan['currency'],
            'description' => 'Darul Kitab ' . $plan['name'] . ' - Full access to Quran audio',
        ],
    ]);

    if (isset($response['error']) && $response['error'] === true) {
        $results[] = [
            'plan' => $plan['name'],
            'status' => 'failed',
            'error' => $response['error']['description'] ?? $response['message'] ?? 'Unknown error',
        ];
        continue;
    }

    $razorpayPlanId = $response['id'];

    // Update DB with Razorpay plan ID
    $stmt = $db->prepare("
        UPDATE subscription_plans 
        SET razorpay_plan_id = ?, price = ?, updated_at = NOW()
        WHERE id = ?
    ");
    $stmt->execute([
        $razorpayPlanId,
        $plan['amount'] / 100, // Store in rupees
        $plan['db_plan_id'],
    ]);

    $results[] = [
        'plan' => $plan['name'],
        'status' => 'created',
        'razorpay_plan_id' => $razorpayPlanId,
        'amount' => '₹' . ($plan['amount'] / 100),
    ];
}

echo json_encode([
    "status" => "success",
    "message" => "Plans processed",
    "plans" => $results,
]);
