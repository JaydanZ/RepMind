-- Workout Programs (user-created workout templates)
CREATE TABLE workout_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  current_day_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Days within a program (e.g., Day 1: Push, Day 2: Pull)
CREATE TABLE program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE NOT NULL,
  day_number INT NOT NULL,
  name TEXT,
  UNIQUE(program_id, day_number)
);

-- Exercises in each program day
CREATE TABLE program_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_day_id UUID REFERENCES program_days(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  target_sets INT NOT NULL DEFAULT 3,
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
  exercise_name TEXT NOT NULL,
  set_number INT NOT NULL,
  weight DECIMAL(10,2),
  reps INT,
  UNIQUE(completed_workout_id, exercise_name, set_number)
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
  exercise_name TEXT NOT NULL,
  weight DECIMAL(10,2),
  reps INT,
  achieved_at DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, exercise_name)
);

-- Indexes for common queries
CREATE INDEX idx_workout_programs_user ON workout_programs(user_id);
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
