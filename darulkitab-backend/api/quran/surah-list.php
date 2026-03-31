<?php
require_once __DIR__ . '/../cors.php';

require_once __DIR__ . "/../config/database.php";

try {
    // ✅ CREATE PDO CONNECTION
    $db = (new Database())->connect();

    $stmt = $db->query("
        SELECT
            id,
            arabic_name,
            english_name,
            ayah_count,
            revelation_type
        FROM surahs
        ORDER BY id
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Failed to load audio list",
        "error" => $e->getMessage()
    ]);
}
