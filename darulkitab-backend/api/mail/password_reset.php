<?php

require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/../vendor/autoload.php';

loadEnvFile(dirname(__DIR__) . '/.env');

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

function passwordResetTtlMinutes(): int
{
    $ttl = (int)env('PASSWORD_RESET_TTL_MINUTES', '60');
    return $ttl > 0 ? $ttl : 60;
}

function passwordResetAppUrl(): string
{
    $configuredUrl = trim(env('APP_BASE_URL', ''));
    if ($configuredUrl !== '') {
        return rtrim($configuredUrl, '/');
    }

    $origin = trim($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($origin !== '') {
        return rtrim($origin, '/');
    }

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost:5173';

    return rtrim($scheme . '://' . $host, '/');
}

function buildPasswordResetUrl(string $token): string
{
    $baseUrl = passwordResetAppUrl();
    $query = http_build_query([
        'page' => 'reset-password',
        'token' => $token,
    ]);

    if (str_contains($baseUrl, '?')) {
        return $baseUrl . '&' . $query;
    }

    return rtrim($baseUrl, '/') . '/?' . $query;
}

function passwordResetSmtpHost(): string
{
    return trim(env('SMTP_HOST', 'smtp.hostinger.com'));
}

function passwordResetSmtpPort(): int
{
    $port = (int)env('SMTP_PORT', '465');
    return $port > 0 ? $port : 465;
}

function passwordResetSmtpEncryption(): string
{
    $encryption = strtolower(trim(env('SMTP_ENCRYPTION', 'ssl')));
    return in_array($encryption, ['ssl', 'tls', 'starttls'], true) ? $encryption : 'ssl';
}

function passwordResetSmtpUsername(): string
{
    return trim(env('SMTP_USERNAME', env('MAIL_FROM_ADDRESS', '')));
}

function passwordResetSmtpPassword(): string
{
    return env('SMTP_PASSWORD', '');
}

function passwordResetSmtpTimeout(): int
{
    $timeout = (int)env('SMTP_TIMEOUT', '15');
    return $timeout > 0 ? $timeout : 15;
}

function passwordResetEmailSubject(string $appName): string
{
    return $appName . ' password reset';
}

function passwordResetEmailBodyHtml(
    string $displayName,
    string $appName,
    string $resetUrl,
    int $ttlMinutes
): string {
    $safeName = htmlspecialchars($displayName, ENT_QUOTES, 'UTF-8');
    $safeResetUrl = htmlspecialchars($resetUrl, ENT_QUOTES, 'UTF-8');
    $safeAppName = htmlspecialchars($appName, ENT_QUOTES, 'UTF-8');

    return <<<HTML
<html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e5e7eb;">
        <h1 style="margin:0 0 16px;font-size:24px;">Reset your password</h1>
        <p style="margin:0 0 16px;">Assalamu Alaikum {$safeName},</p>
        <p style="margin:0 0 16px;">We received a request to reset your {$safeAppName} password.</p>
        <p style="margin:0 0 24px;">Use the button below to choose a new password. This link will expire in {$ttlMinutes} minutes.</p>
        <p style="margin:0 0 24px;">
          <a href="{$safeResetUrl}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:999px;">
            Reset Password
          </a>
        </p>
        <p style="margin:0 0 12px;font-size:14px;color:#4b5563;">If the button does not work, copy and paste this link into your browser:</p>
        <p style="margin:0 0 24px;font-size:14px;word-break:break-all;color:#2563eb;">{$safeResetUrl}</p>
        <p style="margin:0;font-size:14px;color:#6b7280;">If you did not request this, you can safely ignore this email.</p>
      </div>
    </div>
  </body>
</html>
HTML;
}

function passwordResetEmailBodyText(
    string $displayName,
    string $appName,
    string $resetUrl,
    int $ttlMinutes
): string {
    return implode("\n\n", [
        "Assalamu Alaikum {$displayName},",
        "We received a request to reset your {$appName} password.",
        "Use this link within {$ttlMinutes} minutes:",
        $resetUrl,
        'If you did not request this, you can ignore this email.',
    ]);
}

function sendPasswordResetEmail(string $email, string $userName, string $token, ?string &$errorMessage = null): bool
{
    $appName = env('APP_NAME', 'Darul Kitab');
    $fromAddress = trim(env('MAIL_FROM_ADDRESS', 'noreply@quranfahmi.in'));
    $fromName = trim(env('MAIL_FROM_NAME', $appName));
    $replyTo = trim(env('MAIL_REPLY_TO', $fromAddress));
    $smtpHost = passwordResetSmtpHost();
    $smtpPort = passwordResetSmtpPort();
    $smtpUsername = passwordResetSmtpUsername();
    $smtpPassword = passwordResetSmtpPassword();
    $smtpEncryption = passwordResetSmtpEncryption();
    $resetUrl = buildPasswordResetUrl($token);
    $ttlMinutes = passwordResetTtlMinutes();
    $displayName = trim($userName) !== '' ? trim($userName) : 'there';
    $errorMessage = null;

    if ($smtpHost === '' || $smtpUsername === '' || $smtpPassword === '' || $fromAddress === '') {
        $errorMessage = 'SMTP configuration is incomplete. Set SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD, and MAIL_FROM_ADDRESS in api/.env';
        return false;
    }

    $subject = passwordResetEmailSubject($appName);
    $htmlMessage = passwordResetEmailBodyHtml($displayName, $appName, $resetUrl, $ttlMinutes);
    $textMessage = passwordResetEmailBodyText($displayName, $appName, $resetUrl, $ttlMinutes);

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->Port = $smtpPort;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUsername;
        $mail->Password = $smtpPassword;
        $mail->Timeout = passwordResetSmtpTimeout();
        $mail->CharSet = 'UTF-8';

        if ($smtpEncryption === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } else {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        }

        $mail->setFrom($fromAddress, $fromName);
        $mail->addAddress($email, $displayName);

        if ($replyTo !== '') {
            $mail->addReplyTo($replyTo, $fromName);
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlMessage;
        $mail->AltBody = $textMessage;
        $mail->send();

        return true;
    } catch (Exception $exception) {
        $errorMessage = $mail->ErrorInfo ?: $exception->getMessage();
        return false;
    }
}
