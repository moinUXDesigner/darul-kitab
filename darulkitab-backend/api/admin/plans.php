<?php
/**
 * Admin Plans Management
 * 
 * GET  /api/admin/plans.php          — List all Razorpay subscription plans
 * POST /api/admin/plans.php          — Create a new Razorpay plan
 *   Body: { "name": "...", "period": "monthly|yearly|weekly|daily", "interval": 1, "amount": 19900, "db_plan_id": 2 }
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/razorpay.php';

$user = adminGuard();
$db = (new Database())->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // ─── List plans from DB + fetch live status from Razorpay ───
    $stmt = $db->query("SELECT id, name, price, duration_days, razorpay_plan_id, created_at FROM subscription_plans ORDER BY id");
    $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Optionally fetch live info from Razorpay for each plan that has a razorpay_plan_id
    foreach ($plans as &$plan) {
        if (!empty($plan['razorpay_plan_id'])) {
            $rpPlan = razorpayRequest('GET', 'plans/' . $plan['razorpay_plan_id']);
            if (!isset($rpPlan['error'])) {
                $plan['razorpay_status'] = $rpPlan['item']['active'] ?? null;
                $plan['razorpay_name'] = $rpPlan['item']['name'] ?? null;
                $plan['razorpay_amount'] = isset($rpPlan['item']['amount']) ? $rpPlan['item']['amount'] / 100 : null;
                $plan['razorpay_period'] = $rpPlan['period'] ?? null;
            }
        }
    }
    unset($plan);

    echo json_encode(["status" => "success", "data" => $plans]);
    exit;
}

if ($method === 'POST') {
    // ─── Create a new plan in Razorpay + update DB ───
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $period = $input['period'] ?? 'monthly';
    $interval = (int)($input['interval'] ?? 1);
    $amount = (int)($input['amount'] ?? 0); // in paise
    $currency = $input['currency'] ?? 'INR';
    $dbPlanId = (int)($input['db_plan_id'] ?? 0);

    if (!$name || $amount <= 0 || $dbPlanId <= 0) {
        http_response_code(400);
        exit(json_encode(["status" => "error", "message" => "name, amount (paise) and db_plan_id are required"]));
    }

    $response = razorpayRequest('POST', 'plans', [
        'period' => $period,
        'interval' => $interval,
        'item' => [
            'name' => $name,
            'amount' => $amount,
            'currency' => $currency,
            'description' => 'Darul Kitab ' . $name . ' - Full access to Quran audio',
        ],
    ]);

    if (isset($response['error']) && $response['error'] === true) {
        http_response_code(400);
        exit(json_encode([
            "status" => "error",
            "message" => $response['error']['description'] ?? $response['message'] ?? 'Failed to create Razorpay plan',
        ]));
    }

    $razorpayPlanId = $response['id'];

    $stmt = $db->prepare("UPDATE subscription_plans SET razorpay_plan_id = ?, price = ? WHERE id = ?");
    $stmt->execute([$razorpayPlanId, $amount / 100, $dbPlanId]);

    echo json_encode([
        "status" => "success",
        "message" => "Plan created successfully",
        "razorpay_plan_id" => $razorpayPlanId,
        "amount" => '₹' . ($amount / 100),
    ]);
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
