<?php
require_once __DIR__ . '/../config/jwt.php';


function authGuard(): object {
  $headers = getallheaders();

  if (!isset($headers['Authorization'])) {
    http_response_code(401);
    exit(json_encode(["message" => "Missing token"]));
  }

  $token = str_replace('Bearer ', '', $headers['Authorization']);

  try {
    return verifyToken($token)->data;
  } catch (Throwable $e) {
    http_response_code(401);
    exit(json_encode(["message" => "Invalid token"]));
  }
}

?>