import { describe, expect, it } from 'vitest'
import {
  DayValues,
  fieldKey,
  findProgramEdits,
  programBaseline
} from './programEdits'

const savedDays = (): DayValues[] => [
  {
    id: 'd1',
    day: 'Monday',
    focus: 'Upper',
    exercises: [
      { id: 'e1', name: 'Bench Press', sets: '3', reps: '8' },
      { id: 'e2', name: 'Row', sets: '3', reps: '10' }
    ]
  },
  {
    id: 'd2',
    day: 'Thursday',
    focus: 'Lower',
    exercises: [{ id: 'e3', name: 'Squat', sets: '5', reps: '5' }]
  }
]

const editsAfter = (change: (days: DayValues[]) => DayValues[]) =>
  findProgramEdits(programBaseline(savedDays()), change(savedDays()))

describe('findProgramEdits', () => {
  it('reports nothing for an unchanged program', () => {
    const edits = editsAfter((days) => days)

    expect(edits.editedDays.size).toBe(0)
    expect(edits.editedFields.size).toBe(0)
    expect(edits.newDays.size).toBe(0)
    expect(edits.newExercises.size).toBe(0)
  })

  it('marks changed fields and their day', () => {
    const edits = editsAfter(([monday, thursday]) => [
      {
        ...monday,
        day: 'Tuesday',
        focus: 'Push',
        exercises: [{ ...monday.exercises[0], sets: '4' }, monday.exercises[1]]
      },
      thursday
    ])

    expect([...edits.editedFields].sort()).toEqual(
      [
        fieldKey('d1', 'day'),
        fieldKey('d1', 'focus'),
        fieldKey('e1', 'sets')
      ].sort()
    )
    expect([...edits.editedDays]).toEqual(['d1'])
  })

  it('clears a mark when the saved value is restored', () => {
    const edits = editsAfter(([monday, thursday]) => [
      { ...monday, focus: ' Upper ' },
      {
        ...thursday,
        exercises: [{ ...thursday.exercises[0], name: 'Squat', reps: '05' }]
      }
    ])

    expect(edits.editedFields.size).toBe(0)
    expect(edits.editedDays.size).toBe(0)
  })

  it('treats a cleared count as a change', () => {
    const edits = editsAfter(([monday, thursday]) => [
      monday,
      { ...thursday, exercises: [{ ...thursday.exercises[0], reps: '' }] }
    ])

    expect(edits.editedFields.has(fieldKey('e3', 'reps'))).toBe(true)
  })

  it('compares by id after an earlier exercise is removed', () => {
    // Row shifts to index 0, where Bench Press used to be; it's not a rename
    const edits = editsAfter(([monday, thursday]) => [
      { ...monday, exercises: [monday.exercises[1]] },
      thursday
    ])

    expect(edits.editedFields.size).toBe(0)
    expect([...edits.editedDays]).toEqual(['d1'])
  })

  it('marks new exercises and new days as items, not fields', () => {
    const edits = editsAfter(([monday, thursday]) => [
      monday,
      {
        ...thursday,
        exercises: [
          ...thursday.exercises,
          { id: 'e9', name: 'Lunge', sets: '3', reps: '10' }
        ]
      },
      {
        id: 'd9',
        day: 'Saturday',
        focus: 'Arms',
        exercises: [{ id: 'e10', name: 'Curl', sets: '3', reps: '12' }]
      }
    ])

    expect([...edits.newExercises]).toEqual(['e9'])
    expect([...edits.newDays]).toEqual(['d9'])
    expect([...edits.editedDays].sort()).toEqual(['d2', 'd9'])
    expect(edits.editedFields.size).toBe(0)
  })
})
