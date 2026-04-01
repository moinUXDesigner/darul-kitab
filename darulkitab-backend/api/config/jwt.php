<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

const JWT_SECRET = "MI8I)je6MfAOi.o5[?=$+]#k2J13!wI.^dVO#t3d*k}";
const JWT_EXP = 3600;


function createToken(array $payload): string {
return JWT::encode([
'iss' => 'darul-kitab',
'iat' => time(),
'exp' => time() + JWT_EXP,
'data' => $payload
], JWT_SECRET, 'HS256');
}


function verifyToken(string $token): object {
return JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
}
?>