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
$stmt = $db->prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)");
$stmt->execute([$name, $email, 'GOOGLE']);
$id = $db->lastInsertId();
} else {
$id = $user['id'];
}


$token = createToken(['id'=>$id, 'email'=>$email]);


echo json_encode([
'token' => $token,
'user' => ['id'=>$id, 'name'=>$name, 'email'=>$email]
]);
?>