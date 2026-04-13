<?php

function ensureTelemetryTables(PDO $db): void
{
    $db->exec("
        CREATE TABLE IF NOT EXISTS analytics_events (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED DEFAULT NULL,
            event_type VARCHAR(64) NOT NULL,
            session_id VARCHAR(128) DEFAULT NULL,
            audio_id INT DEFAULT NULL,
            surah_no INT DEFAULT NULL,
            value_seconds DECIMAL(10,2) NOT NULL DEFAULT 0,
            metadata JSON DEFAULT NULL,
            occurred_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_event_type_date (event_type, occurred_at),
            KEY idx_user_date (user_id, occurred_at),
            KEY idx_session_date (session_id, occurred_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS audit_trails (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            actor_user_id BIGINT UNSIGNED DEFAULT NULL,
            actor_role VARCHAR(32) DEFAULT NULL,
            action VARCHAR(64) NOT NULL,
            entity_type VARCHAR(64) DEFAULT NULL,
            entity_id VARCHAR(128) DEFAULT NULL,
            description VARCHAR(255) DEFAULT NULL,
            metadata JSON DEFAULT NULL,
            ip_address VARCHAR(45) DEFAULT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            KEY idx_action_date (action, created_at),
            KEY idx_actor_date (actor_user_id, created_at),
            KEY idx_entity (entity_type, entity_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    ");
}

function telemetryJson(?array $value): ?string
{
    if (!$value) {
        return null;
    }

    $encoded = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return $encoded === false ? null : $encoded;
}

function requestIpAddress(): ?string
{
    $candidates = [
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null,
        $_SERVER['HTTP_CLIENT_IP'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
    ];

    foreach ($candidates as $candidate) {
        if (!$candidate) {
            continue;
        }
        $ip = trim(explode(',', $candidate)[0]);
        if ($ip !== '') {
            return mb_substr($ip, 0, 45);
        }
    }

    return null;
}

function logAnalyticsEvent(PDO $db, array $payload): void
{
    ensureTelemetryTables($db);

    $stmt = $db->prepare("
        INSERT INTO analytics_events (
            user_id,
            event_type,
            session_id,
            audio_id,
            surah_no,
            value_seconds,
            metadata,
            occurred_at
        ) VALUES (
            :user_id,
            :event_type,
            :session_id,
            :audio_id,
            :surah_no,
            :value_seconds,
            :metadata,
            NOW()
        )
    ");

    $stmt->execute([
        ':user_id' => isset($payload['user_id']) ? (int)$payload['user_id'] : null,
        ':event_type' => (string)($payload['event_type'] ?? 'unknown'),
        ':session_id' => isset($payload['session_id']) ? (string)$payload['session_id'] : null,
        ':audio_id' => isset($payload['audio_id']) ? (int)$payload['audio_id'] : null,
        ':surah_no' => isset($payload['surah_no']) ? (int)$payload['surah_no'] : null,
        ':value_seconds' => isset($payload['value_seconds']) ? (float)$payload['value_seconds'] : 0,
        ':metadata' => telemetryJson($payload['metadata'] ?? null),
    ]);
}

function logAuditTrail(PDO $db, array $payload): void
{
    ensureTelemetryTables($db);

    $stmt = $db->prepare("
        INSERT INTO audit_trails (
            actor_user_id,
            actor_role,
            action,
            entity_type,
            entity_id,
            description,
            metadata,
            ip_address,
            created_at
        ) VALUES (
            :actor_user_id,
            :actor_role,
            :action,
            :entity_type,
            :entity_id,
            :description,
            :metadata,
            :ip_address,
            NOW()
        )
    ");

    $stmt->execute([
        ':actor_user_id' => isset($payload['actor_user_id']) ? (int)$payload['actor_user_id'] : null,
        ':actor_role' => isset($payload['actor_role']) ? (string)$payload['actor_role'] : null,
        ':action' => (string)($payload['action'] ?? 'unknown'),
        ':entity_type' => isset($payload['entity_type']) ? (string)$payload['entity_type'] : null,
        ':entity_id' => isset($payload['entity_id']) ? (string)$payload['entity_id'] : null,
        ':description' => isset($payload['description']) ? (string)$payload['description'] : null,
        ':metadata' => telemetryJson($payload['metadata'] ?? null),
        ':ip_address' => requestIpAddress(),
    ]);
}
