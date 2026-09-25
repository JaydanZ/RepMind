import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import { ArrowRight, Plus } from 'lucide-react'
import { Workout, WorkoutProgram } from '@/types/programCreation'
import { Button } from '../ui/button'
import {
  panelClass,
  panelHeaderClass,
  panelTitleClass,
  primaryButtonClass,
  skeletonClass
} from './profileStyles'

interface NextWorkoutProps {
  program: WorkoutProgram | null
  isLoading?: boolean
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const normalize = (value: string): string => value.trim().toLowerCase()

const getDayIndex = (day: string): number | null => {
  const normalized = normalize(day)
  for (let i = 0; i < 7; i++) {
    const name = normalize(DAY_NAMES[i])
    if (normalized.startsWith(name) || name.startsWith(normalized)) {
      return i
    }
  }
  return null
}

// Today's workout if scheduled, otherwise the next upcoming day in the week
const resolveWorkout = (structure: Workout[]): Workout | null => {
  if (!structure?.length) return null

  const todayIndex = new Date().getDay()

  const todayMatch = structure.find(
    (workout) => getDayIndex(workout.day) === todayIndex
  )
  if (todayMatch) return todayMatch

  let best: Workout | null = null
  let bestDiff = Infinity
  for (const workout of structure) {
    const dayIndex = getDayIndex(workout.day)
    if (dayIndex === null) continue
    const diff = (dayIndex - todayIndex + 7) % 7
    if (diff >= 1 && diff < bestDiff) {
      bestDiff = diff
      best = workout
    }
  }

  return best
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const NextWorkoutSkeleton = () => (
  <section className={panelClass} aria-busy="true" aria-label="Next workout">
    <div className={panelHeaderClass}>
      <div className={clsx(skeletonClass, 'h-5 w-28')} />
    </div>
    <div className="px-4 py-5 sm:px-6">
      <div className={clsx(skeletonClass, 'h-8 w-40')} />
      <div className={clsx(skeletonClass, 'mt-2 h-4 w-24')} />
      <div className="mt-6 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex justify-between gap-4">
            <div className={clsx(skeletonClass, 'h-4 w-1/2')} />
            <div className={clsx(skeletonClass, 'h-4 w-12')} />
          </div>
        ))}
      </div>
    </div>
  </section>
)

export const NextWorkout = ({ program, isLoading }: NextWorkoutProps) => {
  const navigate = useNavigate()
  const [openTip, setOpenTip] = useState<number | null>(null)
  const workout = useMemo(
    () => resolveWorkout(program?.program_structure ?? []),
    [program]
  )

  if (isLoading) return <NextWorkoutSkeleton />

  if (!program || !workout) {
    return (
      <section aria-labelledby="next-workout-title" className={panelClass}>
        <div className={panelHeaderClass}>
          <h2 id="next-workout-title" className={panelTitleClass}>
            Next workout
          </h2>
        </div>
        <div className="flex flex-col items-start gap-5 px-4 py-8 sm:px-6">
          <div>
            <p className="text-lg font-semibold text-neutral-50">
              No active program yet
            </p>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-neutral-400">
              Set one of your saved programs as active, or generate a new one,
              and your next training day will show up here.
            </p>
          </div>
          <Button
            className={primaryButtonClass}
            onClick={() => navigate({ to: '/aiProgramFactory' })}
          >
            Generate a Program
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </section>
    )
  }

  const isToday = getDayIndex(workout.day) === new Date().getDay()

  return (
    <section aria-labelledby="next-workout-title" className={panelClass}>
      <div className={panelHeaderClass}>
        <h2 id="next-workout-title" className={panelTitleClass}>
          Next workout
        </h2>
        <span
          className={clsx(
            'rounded-full px-2.5 py-1 text-xs font-medium',
            isToday
              ? 'bg-app-colors-300/15 text-app-colors-300'
              : 'bg-neutral-800 text-neutral-300'
          )}
        >
          {isToday ? 'Today' : 'Coming up'}
        </span>
      </div>

      <div className="px-4 pb-2 pt-5 sm:px-6">
        <p className="font-display text-3xl font-bold leading-none text-neutral-50">
          {workout.day}
        </p>
        <p className="mt-2 text-sm text-app-colors-300">{workout.focus}</p>
        <p className="mt-1 text-sm text-neutral-400">
          {program.program_name}
          {program.updated_at && (
            <>, updated {formatDate(program.updated_at)}</>
          )}
        </p>
      </div>

      <ul className="px-4 pb-3 sm:px-6">
        {workout.exercises.map((exercise, index) => {
          const isOpen = openTip === index
          const hasTip = Boolean(exercise.exercise_tip)
          return (
            <li
              key={`${exercise.name}-${index}`}
              className="border-t border-neutral-800/80 first:border-t-0"
            >
              <button
                type="button"
                disabled={!hasTip}
                aria-expanded={hasTip ? isOpen : undefined}
                aria-controls={hasTip ? `next-tip-${index}` : undefined}
                onClick={() => setOpenTip(isOpen ? null : index)}
                className="group flex min-h-12 w-full items-center gap-3 rounded-sm py-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-app-colors-300 disabled:cursor-default"
              >
                <span className="flex-1 text-[0.9375rem] leading-snug text-neutral-100">
                  {exercise.name}
                </span>
                <span className="whitespace-nowrap text-sm tabular-nums text-neutral-400">
                  {exercise.sets} &times; {exercise.reps}
                </span>
                {hasTip && (
                  <Plus
                    aria-hidden
                    className={clsx(
                      'size-4 shrink-0 text-neutral-500 transition-transform duration-200 ease-out-strong group-hover:text-app-colors-300',
                      isOpen && 'rotate-45 text-app-colors-300'
                    )}
                  />
                )}
              </button>
              {hasTip && (
                <div
                  id={`next-tip-${index}`}
                  className={clsx(
                    'grid transition-[grid-template-rows,opacity] duration-200 ease-out-strong',
                    isOpen
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-neutral-400">
                    <span className="block pb-3 pr-7">
                      {exercise.exercise_tip}
                    </span>
                  </p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
