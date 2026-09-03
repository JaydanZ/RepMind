-- Updated Workout Programs Schema to match ProgramImport model
-- This migration updates the schema to align with:
-- ProgramImport { program_name: str, program_structure: list[Workout] }
-- where Workout { day: str, focus: str, exercises: list[Exercise] }
-- and Exercise { exercise_tip: str, name: str, sets: int, reps: int }

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS exercise_set_logs CASCADE;
DROP TABLE IF EXISTS personal_records CASCADE;
DROP TABLE IF EXISTS workout_streaks CASCADE;
DROP TABLE IF EXISTS completed_workouts CASCADE;
DROP TABLE IF EXISTS program_exercises CASCADE;
DROP TABLE IF EXISTS program_days CASCADE;
DROP TABLE IF EXISTS workout_programs CASCADE;

-- Workout Programs (user-created workout templates)
CREATE TABLE workout_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_name TEXT NOT NULL,
  description TEXT,
  program_structure JSONB, -- Stores the full program structure as JSON
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Days within a program (e.g., Day 1: Push, Day 2: Pull)
CREATE TABLE program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL, -- Changed from INT to TEXT to match model's 'day' field
  focus TEXT NOT NULL, -- Added to match model's Workout.focus field
  UNIQUE(program_id, day)
);

-- Exercises in each program day
CREATE TABLE program_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_day_id UUID REFERENCES program_days(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- Changed from 'exercise_name' to match model's Exercise.name
  exercise_tip TEXT, -- Added to match model's Exercise.exercise_tip
  sets INT NOT NULL, -- Changed from 'target_sets' to match model's Exercise.sets
  order_index INT NOT NULL,
  UNIQUE(program_day_id, order_index)
);

-- Completed workouts (one per user per day)
CREATE TABLE completed_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  program_id UUID REFERENCES workout_programs(id) ON DELETE SET NULL,
  program_day_id UUID REFERENCES program_days(id) ON DELETE SET NULL,
  completed_at DATE NOT NULL DEFAULT CURRENT_DATE,
  is_completed BOOLEAN DEFAULT false,
  notes TEXT,
  UNIQUE(user_id, completed_at)
);

-- Individual set logs
CREATE TABLE exercise_set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_workout_id UUID REFERENCES completed_workouts(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- Changed from 'exercise_name' to match program_exercises.name
  set_number INT NOT NULL,
  weight DECIMAL(10,2),
  reps INT,
  UNIQUE(completed_workout_id, name, set_number)
);

-- Workout streaks (denormalized for performance)
CREATE TABLE workout_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_workout_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Personal records (one PR per exercise per user)
CREATE TABLE personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- Changed from 'exercise_name' to match program_exercises.name
  weight DECIMAL(10,2),
  reps INT,
  achieved_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, name)
);

-- Indexes for common queries
CREATE INDEX idx_workout_programs_user ON workout_programs(user_id);
CREATE INDEX idx_workout_programs_name ON workout_programs(program_name);
CREATE INDEX idx_program_days_program ON program_days(program_id);
CREATE INDEX idx_program_exercises_day ON program_exercises(program_day_id);
CREATE INDEX idx_completed_workouts_user_date ON completed_workouts(user_id, completed_at);
CREATE INDEX idx_exercise_set_logs_workout ON exercise_set_logs(completed_workout_id);
CREATE INDEX idx_personal_records_user ON personal_records(user_id);

-- Enable Row Level Security
ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_set_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can manage their own workout programs"
  ON workout_programs FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own program days"
  ON program_days FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_programs
      WHERE workout_programs.id = program_days.program_id
      AND workout_programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own program exercises"
  ON program_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM program_days
      JOIN workout_programs ON workout_programs.id = program_days.program_id
      WHERE program_days.id = program_exercises.program_day_id
      AND workout_programs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own completed workouts"
  ON completed_workouts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own exercise set logs"
  ON exercise_set_logs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM completed_workouts
      WHERE completed_workouts.id = exercise_set_logs.completed_workout_id
      AND completed_workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own workout streaks"
  ON workout_streaks FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own personal records"
  ON personal_records FOR ALL
  USING (auth.uid() = user_id);

-- Helper function to insert program from JSON structure
CREATE OR REPLACE FUNCTION insert_program_from_json(
  p_user_id UUID,
  p_program_name TEXT,
  p_description TEXT,
  p_structure JSONB
) RETURNS VOID AS $$
DECLARE
    v_program_id UUID;
    v_day_id UUID;
    v_exercise_id UUID;
    v_exercises JSONB;
    v_days JSONB;
    i INT;
BEGIN
    -- Insert the program
    INSERT INTO workout_programs (user_id, program_name, description, program_structure)
    VALUES (p_user_id, p_program_name, p_description, p_structure)
    RETURNING id INTO v_program_id;

    -- Parse days from structure
    v_days := p_structure->'program_structure';

    FOR i IN 1..array_length(v_days::INT[], 1) LOOP
        v_day_id := gen_random_uuid();
        
        INSERT INTO program_days (id, program_id, day, focus)
        VALUES (v_day_id, v_program_id, 
                (v_days->>(i-1)::JSONB)->>'day',
                (v_days->>(i-1)::JSONB)->>'focus');

        -- Insert exercises for this day
        v_exercises := (v_days->>(i-1)::JSONB)->>'exercises';
        
        FOR i IN 1..array_length(v_exercises::INT[], 1) LOOP
            v_exercise_id := gen_random_uuid();
            
            INSERT INTO program_exercises (id, program_day_id, name, exercise_tip, sets, order_index)
            VALUES (v_exercise_id, v_day_id,
                    (v_exercises->>(i-1)::JSONB)->>'name',
                    (v_exercises->>(i-1)::JSONB)->>'exercise_tip',
                    (v_exercises->>(i-1)::JSONB)->>'sets',
                    i);
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
