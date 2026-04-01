-- Migration: Add listening_progress table for resume playback
-- Run this on both local and Hostinger databases

CREATE TABLE IF NOT EXISTS `listening_progress` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `audio_id` int(11) NOT NULL,
  `current_time` float NOT NULL DEFAULT 0 COMMENT 'Current playback position in seconds',
  `duration` float NOT NULL DEFAULT 0 COMMENT 'Total duration in seconds',
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_audio` (`user_id`, `audio_id`),
  KEY `idx_user_updated` (`user_id`, `updated_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add Razorpay columns to payments table if not present
ALTER TABLE `payments` 
  ADD COLUMN IF NOT EXISTS `gateway_subscription_id` varchar(100) DEFAULT NULL AFTER `gateway_order_id`;

-- Add Razorpay subscription ID to user_subscriptions if not present
ALTER TABLE `user_subscriptions`
  ADD COLUMN IF NOT EXISTS `razorpay_subscription_id` varchar(100) DEFAULT NULL AFTER `status`;
