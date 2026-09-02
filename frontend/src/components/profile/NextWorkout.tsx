import { useMemo } from 'react'
import { Program } from '@/types/profile'
import { Workout } from '@/types/programCreation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '../ui/button'
import { useNavigate } from '@tanstack/react-router'

interface NextWorkoutProps {
  data?: Program | null
}

const DAY_NAMES: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
}

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

export const NextWorkout = ({ data }: NextWorkoutProps) => {
  const navigate = useNavigate()
  const workout = useMemo(
    () => resolveWorkout(data?.program_structure ?? []),
    [data]
  )

  const handleNavToProgramGenClick = () => {
    navigate({ to: '/aiProgramFactory' })
  }

  const hasWorkout = workout !== null
  const isRestDay =
    hasWorkout && getDayIndex(workout.day) !== new Date().getDay()
  const dayName = hasWorkout ? workout.day ?? '' : 'Rest Day'

  if (!data || !workout) {
    return (
      <Card className="w-full max-w-[1000px] bg-app-colors-500 border-app-colors-400">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div>
              <CardTitle className="text-neutral-50">Next Workout</CardTitle>
              <CardDescription className="text-neutral-400">
                No active program yet
              </CardDescription>
            </div>
            <div className="flex gap-6 text-neutral-50">
              <div className="text-center">
                <div className="text-2xl font-bold text-app-colors-300">—</div>
                <div className="text-xs text-neutral-400">Workout Day</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-400 text-sm">
            Generate or set a workout program as your active program to see your
            next workout day here.
          </p>
        </CardContent>
        <CardFooter>
          <Button
            variant="default"
            size="lg"
            onClick={handleNavToProgramGenClick}
          >
            Generate a Program
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-[1000px] bg-app-colors-500 border-app-colors-400">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-neutral-50">Next Workout</CardTitle>
            <CardDescription className="text-neutral-400">
              {data.name}
              {data.last_updated
                ? ` · updated ${formatDate(data.last_updated)}`
                : ''}
            </CardDescription>
          </div>
          <div className="flex gap-6 text-neutral-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-app-colors-300">
                {dayName}
              </div>
              <div className="text-xs text-neutral-400">
                {workout.focus}
                {isRestDay ? ' · Coming Up' : ''}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col divide-y divide-app-colors-400">
          {workout.exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex flex-row items-start justify-between gap-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-neutral-50 font-medium">
                  {exercise.name}
                </span>
                {exercise.exercise_tip && (
                  <span className="text-xs text-neutral-400 mt-0.5">
                    {exercise.exercise_tip}
                  </span>
                )}
              </div>
              <span className="text-app-colors-300 font-semibold whitespace-nowrap">
                {exercise.sets}×{exercise.reps}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
