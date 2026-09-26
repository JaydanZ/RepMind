import { describe, expect, it } from 'vitest'
import { Workout } from '@/types/programCreation'
import {
  buildSubmission,
  createEntries,
  isExerciseComplete,
  sanitizeWeight,
  sessionReducer,
  SessionState
} from './useWorkoutSession'

const workout: Workout = {
  day: 'Monday',
  focus: 'Upper body',
  exercises: [
    { name: 'Bench Press', sets: 2, reps: 8 },
    { name: 'Pull Up', sets: 1, reps: 10 }
  ]
}

const initialState = (): SessionState => ({
  entries: createEntries(workout.exercises),
  unit: 'lb'
})

describe('useWorkoutSession helpers', () => {
  it('sizes entries from each exercise set count', () => {
    const entries = createEntries(workout.exercises)
    expect(entries.map((sets) => sets.length)).toEqual([2, 1])
  })

  it('marks an exercise complete only when every set has reps', () => {
    let state = initialState()
    state = sessionReducer(state, {
      type: 'updateSet',
      exercise: 0,
      set: 0,
      field: 'reps',
      value: '8'
    })
    expect(isExerciseComplete(state.entries[0])).toBe(false)

    state = sessionReducer(state, {
      type: 'updateSet',
      exercise: 0,
      set: 1,
      field: 'reps',
      value: '7'
    })
    expect(isExerciseComplete(state.entries[0])).toBe(true)
  })

  it('strips invalid characters from reps and weight', () => {
    const state = sessionReducer(initialState(), {
      type: 'updateSet',
      exercise: 0,
      set: 0,
      field: 'reps',
      value: '1a2b'
    })
    expect(state.entries[0][0].reps).toBe('12')
    expect(sanitizeWeight('135,555')).toBe('135.55')
    expect(sanitizeWeight('12.5.5')).toBe('12.55')
  })

  it('only submits sets that have reps', () => {
    let state = initialState()
    state = sessionReducer(state, {
      type: 'fillSet',
      exercise: 0,
      set: 0,
      reps: '8',
      weight: '135'
    })
    state = sessionReducer(state, {
      type: 'updateSet',
      exercise: 0,
      set: 0,
      field: 'notes',
      value: '  felt easy  '
    })
    state = sessionReducer(state, { type: 'setUnit', unit: 'kg' })

    const submission = buildSubmission({
      programId: 'program-1',
      workout,
      state,
      performedOn: '2026-09-26',
      isCompleted: false
    })

    expect(submission.sets).toEqual([
      {
        exercise_name: 'Bench Press',
        exercise_order: 0,
        set_number: 1,
        reps: 8,
        weight: 135,
        weight_unit: 'kg',
        notes: 'felt easy'
      }
    ])
    expect(submission.is_completed).toBe(false)
    expect(submission.day).toBe('Monday')
  })
})
