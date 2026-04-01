<?php

// ================================
// CORS HEADERS
// ================================
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// ================================
// HANDLE PREFLIGHT REQUEST
// ================================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// This endpoint is deprecated and will be replaced with a notification system
http_response_code(410);
echo json_encode([
    "status" => "error",
    "message" => "This endpoint has been deprecated"
]);
