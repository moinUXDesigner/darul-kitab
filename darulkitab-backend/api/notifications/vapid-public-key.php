<?php
/**
 * Get VAPID Public Key
 * 
 * GET /api/notifications/vapid-public-key.php
 * Returns the VAPID public key for PushManager.subscribe()
 */

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/vapid.php';

$keys = getVapidKeys();

echo json_encode([
    "status" => "success",
    "public_key" => $keys['public_base64url'],
]);
