<?php
/**
 * Ensures the listening_progress table has the correct schema.
 * Call once per request that uses listening_progress.
 */
function ensureListeningProgressSchema(PDO $db): void {
    static $checked = false;
    if ($checked) return;
    $checked = true;

    // Check which columns exist
    $cols = $db->query("SHOW COLUMNS FROM listening_progress")->fetchAll(PDO::FETCH_COLUMN);

    // Rename current_time → position_seconds if old schema
    if (in_array('current_time', $cols) && !in_array('position_seconds', $cols)) {
        $db->exec("ALTER TABLE listening_progress CHANGE `current_time` `position_seconds` DECIMAL(10,2) DEFAULT 0.00");
    }

    // Rename duration → duration_seconds if old schema
    if (in_array('duration', $cols) && !in_array('duration_seconds', $cols)) {
        $db->exec("ALTER TABLE listening_progress CHANGE `duration` `duration_seconds` DECIMAL(10,2) DEFAULT 0.00");
    }

    // Add surah_no if missing
    if (!in_array('surah_no', $cols)) {
        $db->exec("ALTER TABLE listening_progress ADD COLUMN `surah_no` INT(11) NOT NULL DEFAULT 0 AFTER `audio_id`");
        // Backfill surah_no from quran_audio
        $db->exec("
            UPDATE listening_progress lp
            JOIN quran_audio qa ON qa.id = lp.audio_id
            SET lp.surah_no = qa.surah_no
            WHERE lp.surah_no = 0
        ");
    }
}
