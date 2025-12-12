export interface programOptions {
  fitness_goal: string
  years_of_experience: string
  days_per_week: string
  age: number
  weight: number
  weight_unit: string
  gender: string
}

export interface Exercise {
  name: string
  sets: number
  reps: number
  exercise_tip: string
}

export interface Workout {
  day: string
  focus: string
  exercises: Exercise[]
}

export interface ProgranGenResult {
  program_structure: Workout[]
  program_tips_and_goals: string[]
}
