
<?php
require_once __DIR__ . '/../cors.php';

require_once __DIR__ . "/../config/database.php";

try {
    // ✅ CREATE PDO CONNECTION
    $db = (new Database())->connect();

    $stmt = $db->query("
        SELECT
            id,
            filename,
            filepath,
            surah_no,
            ayah_start,
            ayah_end,
            reciter,
            duration_seconds
        FROM quran_audio
        WHERE is_active = 1
        ORDER BY surah_no, ayah_start
    ");

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Failed to load audio list",
        "error" => $e->getMessage()
    ]);
}
