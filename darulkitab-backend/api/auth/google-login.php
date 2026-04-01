<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/jwt.php';


$data = json_decode(file_get_contents('php://input'), true);


// Normally verify token via Google API
$email = $data['email'] ?? null;
$name = $data['name'] ?? 'Google User';


if (!$email) {
http_response_code(400);
exit(json_encode(['message'=>'Invalid Google token']));
}


$db = (new Database())->connect();
$stmt = $db->prepare("SELECT * FROM users WHERE email=?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);


if (!$user) {
$stmt = $db->prepare("INSERT INTO users(user_name, email, password_hash, user_role, is_premium) VALUES(?,?,?,?,?)");
$stmt->execute([$name, $email, 'GOOGLE_AUTH', 'user', 0]);
$id = $db->lastInsertId();
$isPremium = false;
$userRole = 'user';
} else {
$id = $user['id'];
$name = $user['user_name'];
$isPremium = (bool)$user['is_premium'];
$userRole = $user['user_role'];
}


$token = createToken(['id'=>$id, 'email'=>$email, 'user_role'=>$userRole, 'is_premium'=>$isPremium]);


echo json_encode([
'token' => $token,
'user' => ['id'=>$id, 'user_name'=>$name, 'email'=>$email, 'user_role'=>$userRole, 'is_premium'=>$isPremium]
]);
?>