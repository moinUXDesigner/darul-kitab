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

function localPlanMeta(int $dbPlanId, string $period = ''): array {
    if ($dbPlanId === 1) {
        return ['name' => 'Free', 'duration_days' => 0, 'period' => 'free'];
    }

    if ($dbPlanId === 2 || $period === 'monthly') {
        return ['name' => 'Monthly', 'duration_days' => 30, 'period' => 'monthly'];
    }

    if ($dbPlanId === 3 || $period === 'yearly') {
        return ['name' => 'Yearly', 'duration_days' => 365, 'period' => 'yearly'];
    }

    return ['name' => '', 'duration_days' => null, 'period' => $period];
}

if ($method === 'GET') {
    // ─── List plans from DB + fetch live status from Razorpay ───
    $stmt = $db->query("
        SELECT
            sp.id,
            COALESCE(NULLIF(sp.name, ''), CASE
                WHEN sp.id = 1 THEN 'Free'
                WHEN sp.id = 2 THEN 'Monthly'
                WHEN sp.id = 3 THEN 'Yearly'
                ELSE CONCAT('Plan ', sp.id)
            END) AS name,
            sp.price,
            sp.duration_days,
            sp.razorpay_plan_id,
            sp.created_at,
            (
                SELECT COUNT(*)
                FROM user_subscriptions us
                WHERE us.plan_id = sp.id AND us.status = 'active'
            ) AS active_subscriptions
        FROM subscription_plans sp
        ORDER BY sp.id
    ");
    $plans = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Optionally fetch live info from Razorpay for each plan that has a razorpay_plan_id
    foreach ($plans as &$plan) {
        if (!empty($plan['razorpay_plan_id'])) {
            $rpPlan = razorpayRequest('GET', 'plans/' . $plan['razorpay_plan_id']);
            if (!razorpayHasError($rpPlan)) {
                $plan['razorpay_status'] = $rpPlan['item']['active'] ?? null;
                $plan['razorpay_name'] = $rpPlan['item']['name'] ?? null;
                $plan['razorpay_amount'] = isset($rpPlan['item']['amount']) ? $rpPlan['item']['amount'] / 100 : null;
                $plan['razorpay_period'] = $rpPlan['period'] ?? null;
            }
        }

        $plan['active_subscriptions'] = (int)($plan['active_subscriptions'] ?? 0);
        $plan['can_delete'] = ((int)$plan['id'] !== 1) && $plan['active_subscriptions'] === 0;
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

    if (!in_array($dbPlanId, [2, 3], true)) {
        http_response_code(400);
        exit(json_encode([
            "status" => "error",
            "message" => "Only DB plan 2 (Monthly) and 3 (Yearly) can be linked to Razorpay",
        ]));
    }

    $expectedPeriod = $dbPlanId === 2 ? 'monthly' : 'yearly';
    if ($period !== $expectedPeriod) {
        http_response_code(400);
        exit(json_encode([
            "status" => "error",
            "message" => "DB plan $dbPlanId must use the $expectedPeriod billing period",
        ]));
    }

    $check = $db->prepare("SELECT id FROM subscription_plans WHERE id = ?");
    $check->execute([$dbPlanId]);
    if (!$check->fetch()) {
        http_response_code(404);
        exit(json_encode(["status" => "error", "message" => "DB plan not found"]));
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

    if (razorpayHasError($response)) {
        http_response_code(400);
        exit(json_encode([
            "status" => "error",
            "message" => razorpayErrorMessage($response, 'Failed to create Razorpay plan'),
        ]));
    }

    $razorpayPlanId = $response['id'];
    $localMeta = localPlanMeta($dbPlanId, $period);

    $stmt = $db->prepare("
        UPDATE subscription_plans
        SET razorpay_plan_id = ?, price = ?, name = ?, duration_days = ?
        WHERE id = ?
    ");
    $stmt->execute([
        $razorpayPlanId,
        $amount / 100,
        $localMeta['name'],
        $localMeta['duration_days'],
        $dbPlanId
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Plan created successfully",
        "razorpay_plan_id" => $razorpayPlanId,
        "amount" => '₹' . ($amount / 100),
        "local_name" => $localMeta['name'],
    ]);
    exit;
}

if ($method === 'PUT') {
    // ─── Update plan in local DB ───
    // Note: Razorpay plans cannot be modified after creation.
    $input = json_decode(file_get_contents('php://input'), true);

    $planId = (int)($input['id'] ?? 0);
    $price = isset($input['price']) ? (float)$input['price'] : null;
    $durationDays = isset($input['duration_days']) ? (int)$input['duration_days'] : null;

    if ($planId <= 0) {
        http_response_code(400);
        exit(json_encode(["status" => "error", "message" => "Plan ID is required"]));
    }

    // Check plan exists
    $check = $db->prepare("SELECT id FROM subscription_plans WHERE id = ?");
    $check->execute([$planId]);
    if (!$check->fetch()) {
        http_response_code(404);
        exit(json_encode(["status" => "error", "message" => "Plan not found"]));
    }

    $updates = [];
    $params = [];

    if ($price !== null && $price >= 0) {
        $updates[] = "price = ?";
        $params[] = $price;
    }
    if ($durationDays !== null && $durationDays >= 0) {
        $updates[] = "duration_days = ?";
        $params[] = $durationDays;
    }

    if (empty($updates)) {
        http_response_code(400);
        exit(json_encode(["status" => "error", "message" => "No fields to update"]));
    }

    $params[] = $planId;
    $stmt = $db->prepare("UPDATE subscription_plans SET " . implode(', ', $updates) . " WHERE id = ?");
    $stmt->execute($params);

    echo json_encode(["status" => "success", "message" => "Plan updated successfully"]);
    exit;
}

if ($method === 'DELETE') {
    // ─── Delete plan from local DB ───
    $planId = (int)($_GET['id'] ?? 0);

    if ($planId <= 0) {
        http_response_code(400);
        exit(json_encode(["status" => "error", "message" => "Plan ID is required"]));
    }

    // Prevent deleting the Free plan (id=1)
    if ($planId === 1) {
        http_response_code(400);
        exit(json_encode(["status" => "error", "message" => "Cannot delete the Free plan"]));
    }

    // Check for active subscriptions using this plan
    $activeSubs = $db->prepare("SELECT COUNT(*) FROM user_subscriptions WHERE plan_id = ? AND status = 'active'");
    $activeSubs->execute([$planId]);
    $count = (int)$activeSubs->fetchColumn();

    if ($count > 0) {
        http_response_code(409);
        exit(json_encode([
            "status" => "error",
            "message" => "Cannot delete: $count active subscription(s) are using this plan",
        ]));
    }

    $stmt = $db->prepare("DELETE FROM subscription_plans WHERE id = ?");
    $stmt->execute([$planId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        exit(json_encode(["status" => "error", "message" => "Plan not found"]));
    }

    echo json_encode(["status" => "success", "message" => "Plan deleted successfully"]);
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Method not allowed"]);
