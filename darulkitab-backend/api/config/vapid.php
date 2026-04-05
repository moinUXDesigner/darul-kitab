<?php
/**
 * VAPID Configuration for Web Push Notifications
 * 
 * Keys are auto-generated on first use and stored in api/storage/.vapid_keys.json.
 * Once generated, do NOT delete the key file — it would invalidate all existing subscriptions.
 */

define('VAPID_SUBJECT', 'mailto:admin@quranfahmi.com');
define('VAPID_KEYS_PATH', __DIR__ . '/../storage/.vapid_keys.json');

/**
 * Get or generate VAPID keys.
 * Returns ['private_pem', 'public_raw', 'public_base64url']
 */
function getVapidKeys(): array
{
    if (file_exists(VAPID_KEYS_PATH)) {
        $keys = json_decode(file_get_contents(VAPID_KEYS_PATH), true);
        if ($keys && !empty($keys['private_pem']) && !empty($keys['public_base64url'])) {
            return $keys;
        }
    }

    // Auto-generate on first use
    require_once __DIR__ . '/../lib/WebPush.php';
    $keys = WebPush::generateVapidKeys();

    $dir = dirname(VAPID_KEYS_PATH);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents(VAPID_KEYS_PATH, json_encode($keys, JSON_PRETTY_PRINT));
    chmod(VAPID_KEYS_PATH, 0600);

    return $keys;
}

/**
 * Get a configured WebPush instance.
 */
function getWebPush(): WebPush
{
    require_once __DIR__ . '/../lib/WebPush.php';
    $keys = getVapidKeys();

    $publicRaw = base64_decode($keys['public_raw']);

    return new WebPush(VAPID_SUBJECT, $keys['private_pem'], $publicRaw);
}
