<?php
// api/cors.php
// Usage: include this file at the top of any PHP endpoint that needs CORS

$allowed_origins = [
    'http://localhost:5173',
    'http://192.168.0.104:5173',
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    // For local dev, allow all to avoid origin mismatch
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
