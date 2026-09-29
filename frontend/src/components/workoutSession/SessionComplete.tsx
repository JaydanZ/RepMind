import { CSSProperties, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import clsx from 'clsx'
import { ArrowRight, Check, Flame } from 'lucide-react'
import { Workout } from '@/types/programCreation'
import { SubmitWorkoutResponse } from '@/types/workoutSession'
import { Button } from '@/components/ui/button'
import { panelClass, primaryButtonClass } from '../profile/profileStyles'
import { SessionSummary, formatNumber, formatSet } from './sessionSummary'

interface SessionCompleteProps {
  result: SubmitWorkoutResponse
  summary: SessionSummary
  workout: Workout
  programName: string
  performedOn: string
}

const STREAK_TICKS = 7
const enter = 'animate-write-in motion-reduce:animate-none'
const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` })

const formatPerformedOn = (dateStr: string) => {
  const date = new Date(`${dateStr}T00:00:00`)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const Stat = ({
  label,
  value,
  suffix
}: {
  label: string
  value: string
  suffix?: string
}) => (
  <div className="min-w-0 px-3 py-4 sm:px-6 sm:py-5">
    <dt className="text-xs font-medium text-neutral-400">{label}</dt>
    <dd className="mt-1 truncate font-display text-xl font-bold tabular-nums leading-tight text-neutral-50 sm:text-2xl">
      {value}
      {suffix && (
        <span className="ml-1 text-sm font-medium text-neutral-400">
          {suffix}
        </span>
      )}
    </dd>
  </div>
)

const StreakMeter = ({ streak }: { streak: number }) => {
  const lit = Math.min(Math.max(streak, 0), STREAK_TICKS)
  return (
    <div aria-hidden className="flex shrink-0 items-end gap-1.5">
      {Array.from({ length: STREAK_TICKS }, (_, index) => {
        const isLit = index < lit
        const isNewest = index === lit - 1
        return (
          <span
            key={index}
            style={isLit ? delay(420 + index * 45) : undefined}
            className={clsx(
              'w-2 origin-bottom rounded-full',
              isNewest ? 'h-7' : 'h-5',
              isLit
                ? 'animate-tick-in motion-reduce:animate-none'
                : 'bg-neutral-800',
              isLit && (isNewest ? 'bg-app-colors-300' : 'bg-app-colors-300/55')
            )}
          />
        )
      })}
    </div>
  )
}

export const SessionComplete = ({
  result,
  summary,
  workout,
  programName,
  performedOn
}: SessionCompleteProps) => {
  const navigate = useNavigate()
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const streak = result.workout_streak
  const loggedExercises = summary.exercises.filter((e) => e.sets.length > 0)

  return (
    <section aria-labelledby="session-complete-title">
      <header className="flex flex-col items-start">
        <span className="relative flex size-12 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-app-colors-300 animate-ring-out motion-reduce:hidden"
          />
          <span className="relative flex size-12 items-center justify-center rounded-full bg-app-colors-300 text-app-colors-500 duration-300 ease-out-strong animate-in fade-in zoom-in-90 motion-reduce:animate-none">
            <Check
              aria-hidden
              strokeWidth={3}
              className="size-6 [&_path]:[stroke-dasharray:24] [&_path]:animate-check-draw motion-reduce:[&_path]:animate-none"
            />
          </span>
        </span>

        <h2
          ref={headingRef}
          id="session-complete-title"
          tabIndex={-1}
          style={delay(80)}
          className={clsx(
            enter,
            'mt-6 font-display text-4xl font-bold leading-none tracking-tight text-neutral-50 outline-none [text-wrap:balance] sm:text-5xl'
          )}
        >
          {summary.isCompleted ? 'Workout complete' : 'Workout saved'}
        </h2>
        <p
          style={delay(140)}
          className={clsx(
            enter,
            'mt-3 text-sm font-medium text-app-colors-300'
          )}
        >
          {workout.day} · {workout.focus}
        </p>
        <p
          style={delay(180)}
          className={clsx(enter, 'mt-1 text-sm text-neutral-400')}
        >
          <span className="break-words">{programName}</span>
          <span aria-hidden className="px-1.5 text-neutral-600">
            /
          </span>
          <time dateTime={performedOn}>{formatPerformedOn(performedOn)}</time>
        </p>
      </header>

      <div style={delay(240)} className={clsx(enter, panelClass, 'mt-8')}>
        <div className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-app-colors-400 text-app-colors-300">
              <Flame aria-hidden className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-xl font-bold leading-tight tabular-nums text-neutral-50">
                {streak}-day streak
              </p>
              <p className="mt-0.5 text-sm leading-snug text-neutral-400">
                {streak <= 1
                  ? 'Day one is on the board.'
                  : 'Train your next scheduled day to extend it.'}
              </p>
            </div>
          </div>
          <StreakMeter streak={streak} />
        </div>

        <dl className="grid grid-cols-3 divide-x divide-neutral-800 border-t border-neutral-800">
          <Stat label="Sets" value={formatNumber(result.sets_logged)} />
          <Stat label="Reps" value={formatNumber(summary.totalReps)} />
          <Stat
            label="Exercises"
            value={`${loggedExercises.length}/${summary.exercises.length}`}
          />
        </dl>

        <div className="border-t border-neutral-800">
          <h3 className="px-4 pb-1 pt-5 text-base font-semibold text-neutral-50 sm:px-6">
            Logged sets
          </h3>
          <ul className="pb-2">
            {summary.exercises.map((exercise, index) => {
              const skipped = exercise.sets.length === 0
              return (
                <li
                  key={`${exercise.name}-${index}`}
                  style={delay(300 + Math.min(index, 8) * 40)}
                  className={clsx(
                    enter,
                    'border-t border-neutral-800/70 px-4 py-3.5 first:border-t-0 sm:px-6'
                  )}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p
                      className={clsx(
                        'min-w-0 text-[0.9375rem] font-medium leading-snug',
                        skipped ? 'text-neutral-500' : 'text-neutral-50'
                      )}
                    >
                      {exercise.name}
                    </p>
                    {skipped ? (
                      <span className="shrink-0 text-sm text-neutral-500">
                        Skipped
                      </span>
                    ) : (
                      exercise.best && (
                        <span className="shrink-0 text-sm tabular-nums">
                          <span className="text-neutral-500">Best </span>
                          <span className="font-medium text-app-colors-300">
                            {formatSet(exercise.best, true)}
                          </span>
                        </span>
                      )
                    )}
                  </div>
                  {!skipped && (
                    <ol
                      aria-label={`${exercise.name} sets`}
                      className="mt-2 flex flex-wrap gap-1.5"
                    >
                      {exercise.sets.map((set) => (
                        <li
                          key={set.set_number}
                          className="rounded-md bg-neutral-800/60 px-2 py-1 text-xs tabular-nums text-neutral-300"
                        >
                          <span className="sr-only">
                            Set {set.set_number}:{' '}
                          </span>
                          {formatSet(set)}
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div
        style={delay(380)}
        className={clsx(enter, 'mt-6 flex flex-col sm:flex-row')}
      >
        <Button
          className={clsx(primaryButtonClass, 'h-11 w-full sm:h-10 sm:w-auto')}
          onClick={() => navigate({ to: '/profile' })}
        >
          Back to profile
          <ArrowRight aria-hidden />
        </Button>
      </div>
    </section>
  )
}
