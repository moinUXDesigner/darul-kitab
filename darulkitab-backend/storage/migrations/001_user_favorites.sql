-- Migration: Create user_favorites table
-- Run on Hostinger phpMyAdmin

CREATE TABLE IF NOT EXISTS `user_favorites` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `audio_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_audio` (`user_id`, `audio_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_favorites_audio` FOREIGN KEY (`audio_id`) REFERENCES `quran_audio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Also ensure listening_progress table exists (in case it wasn't created)
CREATE TABLE IF NOT EXISTS `listening_progress` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `audio_id` int(11) NOT NULL,
  `surah_no` int(11) NOT NULL,
  `position_seconds` decimal(10,2) DEFAULT 0.00,
  `duration_seconds` decimal(10,2) DEFAULT 0.00,
  `completed` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_audio` (`user_id`, `audio_id`),
  KEY `idx_user_surah` (`user_id`, `surah_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
