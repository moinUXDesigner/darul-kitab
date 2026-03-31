<?php

// ================================
// CORS HEADERS
// ================================
// Allowing GET is important for fetching lists
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// ================================
// HANDLE PREFLIGHT REQUEST
// ================================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../auth/middleware.php';
require_once __DIR__ . '/../config/database.php';

// 1. Authenticate the request
// Even without roles, you likely want to ensure the person is logged in
$user = authGuard();

$db = (new Database())->connect();

try {
    /* 2. The SQL Query:
       We select from the 'users' table.
       We use a LEFT JOIN on 'documents' so we can see how many 
       files each user has uploaded.
    */
    $sql = "SELECT 
                u.id, 
                u.name, 
                u.email, 
                COUNT(d.id) AS total_docs 
            FROM users u
            LEFT JOIN documents d ON u.id = d.user_id
            GROUP BY u.id
            ORDER BY u.id DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute();
    
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Return the data as JSON
    echo json_encode($users);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

?>