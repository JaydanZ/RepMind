import { Workout } from './programCreation'

export interface Profile {
  username: string
  email: string
  programs: Program[] | null
  activeProgram: Program | null
}

export interface Program {
  isActiveProgram: boolean
  program_structure: Workout[]
  last_updated: string
}
