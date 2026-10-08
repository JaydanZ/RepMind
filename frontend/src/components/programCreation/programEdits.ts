export interface ExerciseValues {
  id: string
  name: string
  sets: string
  reps: string
}

export interface DayValues {
  id: string
  day: string
  focus: string
  exercises: ExerciseValues[]
}

interface SavedDay {
  day: string
  focus: string
  exercises: Map<string, ExerciseValues>
}

export type ProgramBaseline = Map<string, SavedDay>

export type EditableField = 'day' | 'focus' | 'name' | 'sets' | 'reps'

export interface ProgramEdits {
  newDays: Set<string>
  newExercises: Set<string>
  editedDays: Set<string>
  editedFields: Set<string>
}

export const fieldKey = (id: string, field: EditableField) => `${id}.${field}`

export const textChanged = (current: string, saved: string) =>
  current.trim() !== saved.trim()

const countChanged = (current: string, saved: string) =>
  current.trim() === '' || Number(current) !== Number(saved)

export const programBaseline = (days: DayValues[]): ProgramBaseline =>
  new Map(
    days.map((day) => [
      day.id,
      {
        day: day.day,
        focus: day.focus,
        exercises: new Map(
          day.exercises.map((exercise) => [exercise.id, { ...exercise }])
        )
      }
    ])
  )

export function findProgramEdits(
  baseline: ProgramBaseline,
  days: DayValues[]
): ProgramEdits {
  const edits: ProgramEdits = {
    newDays: new Set(),
    newExercises: new Set(),
    editedDays: new Set(),
    editedFields: new Set()
  }

  for (const day of days) {
    const saved = baseline.get(day.id)
    if (!saved) {
      edits.newDays.add(day.id)
      edits.editedDays.add(day.id)
      continue
    }

    let dayEdited = false
    const markField = (id: string, field: EditableField) => {
      edits.editedFields.add(fieldKey(id, field))
      dayEdited = true
    }

    if (day.day !== saved.day) markField(day.id, 'day')
    if (textChanged(day.focus, saved.focus)) markField(day.id, 'focus')

    for (const exercise of day.exercises) {
      const savedExercise = saved.exercises.get(exercise.id)
      if (!savedExercise) {
        edits.newExercises.add(exercise.id)
        dayEdited = true
        continue
      }
      if (textChanged(exercise.name, savedExercise.name))
        markField(exercise.id, 'name')
      if (countChanged(exercise.sets, savedExercise.sets))
        markField(exercise.id, 'sets')
      if (countChanged(exercise.reps, savedExercise.reps))
        markField(exercise.id, 'reps')
    }

    const currentIds = new Set(day.exercises.map((exercise) => exercise.id))
    for (const savedId of saved.exercises.keys()) {
      if (!currentIds.has(savedId)) dayEdited = true
    }

    if (dayEdited) edits.editedDays.add(day.id)
  }

  return edits
}
