<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../auth/middleware.php';

$user = authGuard();

try {
    $db = (new Database())->connect();

    // Auto-create user_favorites table if missing
    $db->exec("
        CREATE TABLE IF NOT EXISTS `user_favorites` (
            `id` bigint(20) NOT NULL AUTO_INCREMENT,
            `user_id` bigint(20) UNSIGNED NOT NULL,
            `audio_id` int(11) NOT NULL,
            `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `unique_user_audio` (`user_id`, `audio_id`),
            KEY `idx_user_id` (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    ");

    /* ================================
       GET  — check single or list all
    ================================ */
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $audioId = isset($_GET['audio_id']) ? (int)$_GET['audio_id'] : 0;

        // Check if a specific audio is favorited
        if ($audioId > 0) {
            $stmt = $db->prepare("SELECT id FROM user_favorites WHERE user_id = ? AND audio_id = ?");
            $stmt->execute([$user->id, $audioId]);
            echo json_encode(["is_favorite" => (bool)$stmt->fetch()]);
            exit;
        }

        // List all favorites
        $stmt = $db->prepare("
            SELECT uf.audio_id, uf.created_at,
                   qa.filename, qa.surah_no, qa.ayah_start, qa.ayah_end, qa.reciter,
                   s.arabic_name, s.english_name
            FROM user_favorites uf
            JOIN quran_audio qa ON qa.id = uf.audio_id
            JOIN surahs s ON s.id = qa.surah_no
            WHERE uf.user_id = ?
            ORDER BY uf.created_at DESC
        ");
        $stmt->execute([$user->id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        exit;
    }

    /* ================================
       POST — add favorite
    ================================ */
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $audioId = isset($data['audio_id']) ? (int)$data['audio_id'] : 0;

        if ($audioId <= 0) {
            http_response_code(400);
            exit(json_encode(["message" => "audio_id is required"]));
        }

        $stmt = $db->prepare("
            INSERT IGNORE INTO user_favorites (user_id, audio_id)
            VALUES (?, ?)
        ");
        $stmt->execute([$user->id, $audioId]);

        echo json_encode(["success" => true, "is_favorite" => true]);
        exit;
    }

    /* ================================
       DELETE — remove favorite
    ================================ */
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $audioId = isset($_GET['audio_id']) ? (int)$_GET['audio_id'] : 0;

        if ($audioId <= 0) {
            http_response_code(400);
            exit(json_encode(["message" => "audio_id is required"]));
        }

        $stmt = $db->prepare("DELETE FROM user_favorites WHERE user_id = ? AND audio_id = ?");
        $stmt->execute([$user->id, $audioId]);

        echo json_encode(["success" => true, "is_favorite" => false]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);

} catch (PDOException $e) {
    error_log("Favorites error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["message" => "Server error"]);
}
