-- Migration Phase 3: Premium Gating + Progress Tracking
-- Run this on Hostinger database (phpMyAdmin → SQL tab)

-- 1. Create listening_progress table
CREATE TABLE IF NOT EXISTS `listening_progress` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `audio_id` int(11) NOT NULL,
  `surah_no` int(11) NOT NULL,
  `position_seconds` decimal(10,2) NOT NULL DEFAULT 0.00,
  `duration_seconds` decimal(10,2) NOT NULL DEFAULT 0.00,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_audio` (`user_id`, `audio_id`),
  KEY `idx_user_surah` (`user_id`, `surah_no`),
  KEY `idx_user_recent` (`user_id`, `completed`, `updated_at`),
  CONSTRAINT `fk_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_progress_audio` FOREIGN KEY (`audio_id`) REFERENCES `quran_audio` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
