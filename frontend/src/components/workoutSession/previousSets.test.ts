import { describe, expect, it } from 'vitest'
import { PreviousExercise } from '@/types/workoutSession'
import {
  bestPreviousSet,
  previousSetFor,
  toPreviousValues
} from './previousSets'

const previous: PreviousExercise = {
  date: '2026-09-24',
  sets: [
    { set_number: 1, reps: 8, weight: 135, weight_unit: 'lb' },
    { set_number: 2, reps: 6, weight: 145, weight_unit: 'lb' }
  ]
}

describe('previous set helpers', () => {
  it('matches by set number and falls back to the last logged set', () => {
    expect(previousSetFor(previous, 1)?.weight).toBe(135)
    expect(previousSetFor(previous, 3)?.weight).toBe(145)
    expect(previousSetFor(undefined, 1)).toBeUndefined()
  })

  it('formats reps and weight in the current unit', () => {
    expect(toPreviousValues(previous.sets[0], 'lb')).toEqual({
      reps: '8',
      weight: '135',
      text: '135 lb × 8'
    })
    expect(toPreviousValues(previous.sets[0], 'kg')?.weight).toBe('61')
    expect(
      toPreviousValues(
        { set_number: 1, reps: 5, weight: 100, weight_unit: 'kg' },
        'lb'
      )?.weight
    ).toBe('220.5')
    expect(
      toPreviousValues(
        { set_number: 1, reps: 12, weight: null, weight_unit: 'lb' },
        'lb'
      )?.text
    ).toBe('12 reps')
  })

  it('picks the heaviest set as the best', () => {
    expect(bestPreviousSet(previous)?.set_number).toBe(2)
  })
})
