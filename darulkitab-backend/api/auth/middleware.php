<?php
require_once __DIR__ . '/../config/jwt.php';


function authGuard(): object {
  $token = null;

  // 1. Query-string token (most reliable for HTMLAudioElement)
  if (isset($_GET['token']) && $_GET['token'] !== '') {
    $token = $_GET['token'];
  }

  // 2. Standard Authorization header
  if (!$token) {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    if ($headers) {
      // Case-insensitive search (LiteSpeed/nginx may lowercase header names)
      foreach ($headers as $key => $value) {
        if (strtolower($key) === 'authorization') {
          $token = str_replace('Bearer ', '', $value);
          break;
        }
      }
    }
  }

  // 3. Apache/LiteSpeed CGI/FastCGI fallbacks
  if (!$token && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
    $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
  }
  if (!$token && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $token = str_replace('Bearer ', '', $_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
  }

  if (!$token) {
    http_response_code(401);
    header('Content-Type: application/json');
    exit(json_encode([
      "message" => "Missing token",
      "hint" => "Pass token as ?token= query param or Authorization: Bearer header"
    ]));
  }

  try {
    return verifyToken($token)->data;
  } catch (Throwable $e) {
    http_response_code(401);
    header('Content-Type: application/json');
    exit(json_encode([
      "message" => "Invalid or expired token",
      "error" => $e->getMessage()
    ]));
  }
}

?>