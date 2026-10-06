import { describe, expect, it } from 'vitest'
import { WorkoutProgram } from '@/types/programCreation'
import { orderProgramsActiveFirst } from './programOrder'

const program = (id: string) => ({ id }) as WorkoutProgram
const ids = (programs: WorkoutProgram[]) => programs.map(({ id }) => id)

describe('orderProgramsActiveFirst', () => {
  const programs = [program('a'), program('b'), program('c'), program('d')]

  it('moves the active program to the top and keeps the rest in order', () => {
    expect(ids(orderProgramsActiveFirst(programs, 'c'))).toEqual([
      'c',
      'a',
      'b',
      'd'
    ])
  })

  it('leaves the list unchanged when the active program is already first', () => {
    expect(orderProgramsActiveFirst(programs, 'a')).toBe(programs)
  })

  it('leaves the list unchanged when there is no matching active program', () => {
    expect(orderProgramsActiveFirst(programs, null)).toBe(programs)
    expect(orderProgramsActiveFirst(programs, 'missing')).toBe(programs)
  })
})
