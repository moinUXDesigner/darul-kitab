<?php
require_once __DIR__ . '/../config/jwt.php';


function authGuard(): object {
  $headers = getallheaders();
  $token = null;

  if (isset($headers['Authorization'])) {
    $token = str_replace('Bearer ', '', $headers['Authorization']);
  } elseif (isset($_GET['token']) && $_GET['token'] !== '') {
    // Fallback for HTMLAudioElement requests where custom headers are not supported.
    $token = $_GET['token'];
  }

  if (!$token) {
    http_response_code(401);
    exit(json_encode(["message" => "Missing token"]));
  }

  try {
    return verifyToken($token)->data;
  } catch (Throwable $e) {
    http_response_code(401);
    exit(json_encode(["message" => "Invalid token"]));
  }
}

?>