<?php
/**
 * WebPush - Send Web Push notifications using RFC 8291 encryption
 * 
 * Uses PHP's OpenSSL extension + firebase/php-jwt for VAPID signing.
 * No external web-push library required.
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;

class WebPush
{
    private string $vapidSubject;
    private string $vapidPrivatePem;
    private string $vapidPublicRaw; // 65-byte uncompressed EC point

    public function __construct(string $vapidSubject, string $vapidPrivatePem, string $vapidPublicRaw)
    {
        $this->vapidSubject = $vapidSubject;
        $this->vapidPrivatePem = $vapidPrivatePem;
        $this->vapidPublicRaw = $vapidPublicRaw;
    }

    /**
     * Send a push notification with encrypted JSON payload.
     */
    public function send(string $endpoint, string $p256dh, string $auth, string $payload): array
    {
        try {
            $encrypted = $this->encrypt($payload, $p256dh, $auth);
            $vapidAuth = $this->getVapidAuth($endpoint);

            $ch = curl_init($endpoint);
            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => $encrypted,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/octet-stream',
                    'Content-Encoding: aes128gcm',
                    'Content-Length: ' . strlen($encrypted),
                    'Authorization: ' . $vapidAuth,
                    'TTL: 86400',
                    'Urgency: normal',
                ],
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);

            return [
                'success' => $httpCode >= 200 && $httpCode < 300,
                'http_code' => $httpCode,
                'response' => $response,
                'error' => $error ?: null,
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'http_code' => 0,
                'response' => null,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Encrypt the payload using RFC 8291 (aes128gcm content encoding).
     */
    private function encrypt(string $payload, string $p256dhBase64url, string $authBase64url): string
    {
        // 1. Ephemeral ECDH key pair
        $localKey = openssl_pkey_new([
            'curve_name' => 'prime256v1',
            'private_key_type' => OPENSSL_KEYTYPE_EC,
        ]);
        $localDetails = openssl_pkey_get_details($localKey);
        $localPublicRaw = "\x04" . $localDetails['ec']['x'] . $localDetails['ec']['y'];

        // 2. Decode subscriber keys
        $subscriberPublicRaw = self::base64UrlDecode($p256dhBase64url);
        $subscriberAuth = self::base64UrlDecode($authBase64url);

        // 3. ECDH shared secret
        $subscriberPem = self::rawKeyToPem($subscriberPublicRaw);
        $subscriberPubKey = openssl_pkey_get_public($subscriberPem);
        if (!$subscriberPubKey) {
            throw new \RuntimeException('Failed to parse subscriber public key');
        }

        $sharedSecret = openssl_pkey_derive($subscriberPubKey, $localKey);
        if ($sharedSecret === false) {
            throw new \RuntimeException('ECDH key derivation failed');
        }

        // 4. Derive IKM from shared secret + auth
        $authInfo = "WebPush: info\x00" . $subscriberPublicRaw . $localPublicRaw;
        $ikm = hash_hkdf('sha256', $sharedSecret, 32, $authInfo, $subscriberAuth);

        // 5. Random salt
        $salt = random_bytes(16);

        // 6. Derive content encryption key (CEK) and nonce
        $cek = hash_hkdf('sha256', $ikm, 16, "Content-Encoding: aes128gcm\x00", $salt);
        $nonce = hash_hkdf('sha256', $ikm, 12, "Content-Encoding: nonce\x00", $salt);

        // 7. Pad payload (0x02 = final record delimiter)
        $padded = $payload . "\x02";

        // 8. AES-128-GCM encrypt
        $tag = '';
        $ciphertext = openssl_encrypt($padded, 'aes-128-gcm', $cek, OPENSSL_RAW_DATA, $nonce, $tag);
        if ($ciphertext === false) {
            throw new \RuntimeException('AES-128-GCM encryption failed');
        }

        // 9. Build aes128gcm message (RFC 8188)
        $recordSize = 4096;
        $body = $salt
            . pack('N', $recordSize)
            . chr(strlen($localPublicRaw))
            . $localPublicRaw
            . $ciphertext
            . $tag;

        return $body;
    }

    /**
     * Create VAPID authorization header.
     */
    private function getVapidAuth(string $endpoint): string
    {
        $url = parse_url($endpoint);
        $audience = $url['scheme'] . '://' . $url['host'];

        $jwt = JWT::encode([
            'aud' => $audience,
            'exp' => time() + 86400,
            'sub' => $this->vapidSubject,
        ], $this->vapidPrivatePem, 'ES256');

        $k = self::base64UrlEncode($this->vapidPublicRaw);
        return "vapid t={$jwt}, k={$k}";
    }

    /**
     * Convert a 65-byte raw EC public key to PEM format.
     */
    public static function rawKeyToPem(string $rawPublicKey): string
    {
        // DER prefix for EC P-256 SubjectPublicKeyInfo
        $derPrefix = "\x30\x59\x30\x13\x06\x07\x2a\x86\x48\xce\x3d\x02\x01"
                   . "\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07\x03\x42\x00";
        $der = $derPrefix . $rawPublicKey;
        return "-----BEGIN PUBLIC KEY-----\n"
             . chunk_split(base64_encode($der), 64, "\n")
             . "-----END PUBLIC KEY-----";
    }

    /**
     * Generate a VAPID ECDSA P-256 key pair.
     */
    public static function generateVapidKeys(): array
    {
        $key = openssl_pkey_new([
            'curve_name' => 'prime256v1',
            'private_key_type' => OPENSSL_KEYTYPE_EC,
        ]);
        if (!$key) {
            throw new \RuntimeException('Failed to generate EC key: ' . openssl_error_string());
        }

        openssl_pkey_export($key, $privatePem);
        $details = openssl_pkey_get_details($key);
        $publicRaw = "\x04" . $details['ec']['x'] . $details['ec']['y'];

        return [
            'private_pem' => $privatePem,
            'public_raw' => base64_encode($publicRaw),
            'public_base64url' => self::base64UrlEncode($publicRaw),
        ];
    }

    public static function base64UrlDecode(string $input): string
    {
        $remainder = strlen($input) % 4;
        if ($remainder) {
            $input .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($input, '-_', '+/'));
    }

    public static function base64UrlEncode(string $input): string
    {
        return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
    }
}
