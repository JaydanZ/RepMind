-- Migration: Add current_streak and active_program fields to users table
-- Adds a denormalized current_streak field for performance and an active_program foreign key

ALTER TABLE users 
  ADD COLUMN current_streak INT NOT NULL DEFAULT 0,
  ADD COLUMN active_program UUID REFERENCES workout_programs(id) ON DELETE SET NULL;

-- Index on active_program for efficient lookups
CREATE INDEX idx_users_active_program ON users(active_program);
