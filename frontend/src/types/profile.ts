import { Workout } from './programCreation'

export interface Profile {
  username: string
  email: string
  programs: Program[] | null
  active_program: Program | null
  workout_streak_tracker: WorkoutTracker[] | null
}

export interface WorkoutTracker {
  has_worked_out: boolean
  program_link: string | null
  date: string | null
}

export interface Program {
  is_active_program: boolean
  program_structure: Workout[]
  last_updated: string
}
