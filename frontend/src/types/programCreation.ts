export interface ProgramOptions {
  fitness_goal: string
  years_of_experience: string
  days_per_week: string
  age: number
  weight: number
  weight_unit: string
  gender: string
  isLoggedIn: boolean
}

export interface ProgramSubmission extends ProgramOptions {
  freeLimitEnabled: boolean
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
  program_structure: Workout[] | null
  program_tips_and_goals: string[] | null
}
