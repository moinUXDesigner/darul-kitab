<?php

/**
 * Minimal .env reader for the PHP API.
 */
function loadEnvFile(string $path): void
{
    static $loaded = [];

    if (isset($loaded[$path]) || !is_file($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }

        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        $quotedWithDouble = strlen($value) >= 2 && $value[0] === '"' && substr($value, -1) === '"';
        $quotedWithSingle = strlen($value) >= 2 && $value[0] === "'" && substr($value, -1) === "'";

        if ($quotedWithDouble || $quotedWithSingle) {
            $value = substr($value, 1, -1);
        }

        putenv($name . '=' . $value);
        $_ENV[$name] = $value;

        if (!isset($_SERVER[$name])) {
            $_SERVER[$name] = $value;
        }
    }

    $loaded[$path] = true;
}

function env(string $key, string $default = ''): string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

    if ($value === false || $value === null || $value === '') {
        return $default;
    }

    return (string)$value;
}
