-- Migration Phase 4 Fix: Add missing Razorpay columns
-- Run this on Hostinger database (phpMyAdmin → SQL tab)

-- 1. Add razorpay_subscription_id to user_subscriptions
ALTER TABLE `user_subscriptions`
  ADD COLUMN IF NOT EXISTS `razorpay_subscription_id` varchar(100) DEFAULT NULL AFTER `plan_id`;

-- 2. Expand status enum to include 'created' and 'completed'
ALTER TABLE `user_subscriptions`
  MODIFY COLUMN `status` varchar(20) NOT NULL DEFAULT 'created';

-- 3. Add gateway_subscription_id to payments (code references it)
ALTER TABLE `payments`
  ADD COLUMN IF NOT EXISTS `gateway_subscription_id` varchar(255) DEFAULT NULL AFTER `gateway_order_id`;
