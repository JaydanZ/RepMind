import { WorkoutProgram } from '@/types/programCreation'

export const orderProgramsActiveFirst = (
  programs: WorkoutProgram[],
  activeProgramId: string | null
): WorkoutProgram[] => {
  const activeIndex = programs.findIndex(
    (program) => program.id === activeProgramId
  )
  if (activeIndex <= 0) return programs

  return [
    programs[activeIndex],
    ...programs.slice(0, activeIndex),
    ...programs.slice(activeIndex + 1)
  ]
}
