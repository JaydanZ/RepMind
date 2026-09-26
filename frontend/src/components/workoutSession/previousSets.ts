import {
  PreviousExercise,
  PreviousSet,
  WeightUnit
} from '@/types/workoutSession'

const LB_PER_KG = 2.20462

// Converted weights round to the nearest 0.5 so they match real plates
export const convertWeight = (
  weight: number,
  from: WeightUnit,
  to: WeightUnit
): number => {
  if (from === to) return weight
  const converted = from === 'kg' ? weight * LB_PER_KG : weight / LB_PER_KG
  return Math.round(converted * 2) / 2
}

export const formatWeight = (weight: number): string =>
  Number.isInteger(weight) ? String(weight) : weight.toFixed(1)

export interface PreviousValues {
  reps: string
  weight: string | null
  text: string
}

export const toPreviousValues = (
  set: PreviousSet | undefined,
  unit: WeightUnit
): PreviousValues | null => {
  if (!set || set.reps == null) return null
  const weight =
    set.weight != null
      ? formatWeight(convertWeight(set.weight, set.weight_unit, unit))
      : null
  return {
    reps: String(set.reps),
    weight,
    text: weight != null ? `${weight} ${unit} × ${set.reps}` : `${set.reps} reps`
  }
}

// If today has more sets than last time, extra sets reuse the last logged set
export const previousSetFor = (
  previous: PreviousExercise | undefined,
  setNumber: number
): PreviousSet | undefined => {
  if (!previous?.sets.length) return undefined
  return (
    previous.sets.find((set) => set.set_number === setNumber) ??
    previous.sets[previous.sets.length - 1]
  )
}

// Heaviest set from the last session, ties broken by reps
export const bestPreviousSet = (
  previous: PreviousExercise | undefined
): PreviousSet | undefined => {
  const sets = previous?.sets.filter((set) => set.reps != null) ?? []
  if (!sets.length) return undefined
  const toKg = (set: PreviousSet) =>
    set.weight == null ? -1 : convertWeight(set.weight, set.weight_unit, 'kg')
  return sets.reduce((best, set) => {
    const diff = toKg(set) - toKg(best)
    if (diff > 0) return set
    if (diff === 0 && (set.reps ?? 0) > (best.reps ?? 0)) return set
    return best
  })
}
