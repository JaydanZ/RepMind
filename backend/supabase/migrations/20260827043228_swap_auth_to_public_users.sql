-- Migration: Swap auth.users(id) to public.users(id) references
-- This migration updates all foreign key constraints from auth.users(id) to public.users(id)

-- Update workout_programs table
ALTER TABLE workout_programs 
  DROP CONSTRAINT IF EXISTS workout_programs_user_id_fkey,
  ADD CONSTRAINT workout_programs_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update completed_workouts table
ALTER TABLE completed_workouts 
  DROP CONSTRAINT IF EXISTS completed_workouts_user_id_fkey,
  ADD CONSTRAINT completed_workouts_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update workout_streaks table
ALTER TABLE workout_streaks 
  DROP CONSTRAINT IF EXISTS workout_streaks_user_id_fkey,
  ADD CONSTRAINT workout_streaks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update personal_records table
ALTER TABLE personal_records 
  DROP CONSTRAINT IF EXISTS personal_records_user_id_fkey,
  ADD CONSTRAINT personal_records_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
