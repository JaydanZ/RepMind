import { memo } from 'react'
import clsx from 'clsx'
import { PreviousSet, SetEntry, WeightUnit } from '@/types/workoutSession'
import { isSetComplete } from '@/hooks/useWorkoutSession'
import { skeletonClass } from '../profile/profileStyles'

export const setGridClass =
  'grid grid-cols-[1.75rem_minmax(0,1fr)_4rem_5rem] items-center gap-x-2 sm:grid-cols-[2rem_minmax(0,1fr)_5rem_6rem] sm:gap-x-3'

const inputClass =
  'h-10 w-full min-w-0 rounded-md border border-neutral-800 bg-neutral-900/70 px-2 text-center text-base tabular-nums text-neutral-50 outline-none transition-[border-color,background-color] duration-150 ease-out placeholder:text-neutral-600 hover:border-neutral-700 focus:border-app-colors-300/70 focus:bg-neutral-900'

const LB_PER_KG = 2.20462

const convertWeight = (weight: number, from: WeightUnit, to: WeightUnit) => {
  if (from === to) return weight
  const converted = from === 'kg' ? weight * LB_PER_KG : weight / LB_PER_KG
  return Math.round(converted * 2) / 2
}

const formatWeight = (weight: number) =>
  Number.isInteger(weight) ? String(weight) : weight.toFixed(1)

interface SetRowProps {
  exerciseIndex: number
  setIndex: number
  exerciseName: string
  entry: SetEntry
  targetReps: number
  unit: WeightUnit
  previous?: PreviousSet
  previousLoading: boolean
  onChange: (
    exercise: number,
    set: number,
    field: keyof SetEntry,
    value: string
  ) => void
  onFill: (exercise: number, set: number, reps: string, weight: string) => void
}

export const SetRow = memo(
  ({
    exerciseIndex,
    setIndex,
    exerciseName,
    entry,
    targetReps,
    unit,
    previous,
    previousLoading,
    onChange,
    onFill
  }: SetRowProps) => {
    const setNumber = setIndex + 1
    const complete = isSetComplete(entry)
    const label = `${exerciseName}, set ${setNumber}`

    const previousWeight =
      previous?.weight != null
        ? convertWeight(previous.weight, previous.weight_unit, unit)
        : null
    const hasPrevious = previous != null && previous.reps != null
    const previousText = hasPrevious
      ? previousWeight != null
        ? `${formatWeight(previousWeight)} ${unit} × ${previous.reps}`
        : `${previous.reps} reps`
      : null

    return (
      <li className="py-2.5">
        <div className={setGridClass}>
          <span
            aria-hidden
            className={clsx(
              'flex size-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors duration-150',
              complete
                ? 'bg-app-colors-300 text-app-colors-500'
                : 'bg-neutral-800 text-neutral-400'
            )}
          >
            {setNumber}
          </span>

          {previousLoading ? (
            <span className={clsx(skeletonClass, 'h-4 w-20')} />
          ) : previousText ? (
            <button
              type="button"
              onClick={() =>
                onFill(
                  exerciseIndex,
                  setIndex,
                  String(previous?.reps ?? ''),
                  previousWeight != null ? formatWeight(previousWeight) : ''
                )
              }
              aria-label={`Use last session for ${label}: ${previousText}`}
              title="Use last session"
              className="-ml-1.5 min-w-0 justify-self-start truncate rounded px-1.5 py-1 text-left text-sm tabular-nums text-neutral-400 outline-none transition-[color,transform] duration-150 ease-out hover:text-app-colors-300 focus-visible:ring-1 focus-visible:ring-app-colors-300 active:scale-[0.97]"
            >
              {previousText}
            </button>
          ) : (
            <span className="text-sm text-neutral-600">
              <span aria-hidden>&ndash;</span>
              <span className="sr-only">No previous session</span>
            </span>
          )}

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            enterKeyHint="next"
            aria-label={`${label} reps`}
            placeholder={String(targetReps)}
            value={entry.reps}
            onChange={(event) =>
              onChange(exerciseIndex, setIndex, 'reps', event.target.value)
            }
            className={inputClass}
          />
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            enterKeyHint="next"
            aria-label={`${label} weight in ${unit}`}
            placeholder={unit}
            value={entry.weight}
            onChange={(event) =>
              onChange(exerciseIndex, setIndex, 'weight', event.target.value)
            }
            className={inputClass}
          />

          <input
            type="text"
            autoComplete="off"
            maxLength={280}
            aria-label={`${label} notes`}
            placeholder="Add a note"
            value={entry.notes}
            onChange={(event) =>
              onChange(exerciseIndex, setIndex, 'notes', event.target.value)
            }
            className={clsx(
              inputClass,
              'col-start-2 col-end-5 mt-2 h-9 px-3 text-left text-[0.9375rem] sm:text-sm'
            )}
          />
        </div>
      </li>
    )
  }
)

SetRow.displayName = 'SetRow'
