-- Migration Phase 2: Razorpay Integration
-- Run this on Hostinger database (phpMyAdmin → SQL tab)

-- 1. Add razorpay_plan_id column to subscription_plans
ALTER TABLE `subscription_plans`
  ADD COLUMN IF NOT EXISTS `razorpay_plan_id` varchar(100) DEFAULT NULL AFTER `duration_days`,
  ADD COLUMN IF NOT EXISTS `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp();

-- 2. Update pricing to ₹199/₹1999
UPDATE `subscription_plans` SET `price` = 0, `duration_days` = 0 WHERE `id` = 1;
UPDATE `subscription_plans` SET `price` = 199, `name` = 'Monthly Premium', `duration_days` = 30 WHERE `id` = 2;
UPDATE `subscription_plans` SET `price` = 1999, `name` = 'Yearly Premium', `duration_days` = 365 WHERE `id` = 3;

-- 3. Add created_at to payments if not present
ALTER TABLE `payments`
  ADD COLUMN IF NOT EXISTS `created_at` timestamp NOT NULL DEFAULT current_timestamp();

-- 4. Add created_at to user_subscriptions if not present  
ALTER TABLE `user_subscriptions`
  ADD COLUMN IF NOT EXISTS `created_at` timestamp NOT NULL DEFAULT current_timestamp();
