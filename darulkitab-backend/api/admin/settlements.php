<?php
/**
 * Admin Razorpay Settlements (Bank Credit Status)
 * 
 * GET /api/admin/settlements.php?page=1&limit=20
 * Returns settlement items from Razorpay (bank transfers/credits)
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/razorpay.php';

$user = adminGuard();

$count = min(50, max(1, (int)($_GET['limit'] ?? 20)));
$skip = max(0, ((int)($_GET['page'] ?? 1) - 1) * $count);

// Fetch settlements from Razorpay
$response = razorpayRequest('GET', "settlements?count=$count&skip=$skip");

if (isset($response['error']) && $response['error'] === true) {
    http_response_code(400);
    exit(json_encode([
        "status" => "error",
        "message" => $response['error']['description'] ?? $response['message'] ?? 'Failed to fetch settlements',
    ]));
}

$items = $response['items'] ?? [];
$total = $response['count'] ?? 0;

echo json_encode([
    "status" => "success",
    "total" => $total,
    "data" => $items,
]);
