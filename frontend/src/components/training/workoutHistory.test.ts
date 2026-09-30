import { describe, expect, it } from 'vitest'
import { WorkoutHistoryEntry } from '@/types/workoutSession'
import { countSets, dateTile, formatSet, parseLogDate } from './workoutHistory'

describe('previous workouts helpers', () => {
  it('parses logged dates as local calendar days', () => {
    const date = parseLogDate('2026-03-01')
    expect(date?.getFullYear()).toBe(2026)
    expect(date?.getMonth()).toBe(2)
    expect(date?.getDate()).toBe(1)
  })

  it('rejects malformed dates instead of rendering Invalid Date', () => {
    expect(parseLogDate('not-a-date')).toBeNull()
    expect(parseLogDate('2026-13-45')).toBeNull()
    expect(dateTile('garbage')).toEqual({
      month: '',
      day: 'garbage',
      label: 'garbage'
    })
  })

  it('includes the year in the label only for past years', () => {
    expect(dateTile('2019-06-04').label).toContain('2019')
    const thisYear = `${new Date().getFullYear()}-01-15`
    expect(dateTile(thisYear).label).not.toContain(
      String(new Date().getFullYear())
    )
  })

  it('formats weighted and bodyweight sets', () => {
    expect(
      formatSet({ set_number: 1, reps: 8, weight: 135, weight_unit: 'lb' })
    ).toBe('8 × 135 lb')
    expect(
      formatSet({ set_number: 1, reps: 5, weight: 62.5, weight_unit: 'kg' })
    ).toBe('5 × 62.5 kg')
    expect(
      formatSet({ set_number: 1, reps: 1, weight: null, weight_unit: 'lb' })
    ).toBe('1 rep')
  })

  it('counts sets across exercises', () => {
    const workout: WorkoutHistoryEntry = {
      id: 'w1',
      date: '2026-09-28',
      day: 'Monday',
      focus: 'Upper body',
      program_name: 'Strength',
      is_completed: true,
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            { set_number: 1, reps: 8, weight: 135, weight_unit: 'lb' },
            { set_number: 2, reps: 8, weight: 135, weight_unit: 'lb' }
          ]
        },
        {
          name: 'Pull Up',
          sets: [{ set_number: 1, reps: 10, weight: null, weight_unit: 'lb' }]
        }
      ]
    }
    expect(countSets(workout)).toBe(3)
  })
})
