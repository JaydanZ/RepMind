import { useMemo } from 'react'
import { WorkoutTracker } from '@/types/profile'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface WorkoutStreakTrackerProps {
  data?: WorkoutTracker[] | null
}

// Generate last 365 days of dates
const generateYearDates = () => {
  const dates: Date[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    dates.push(date)
  }

  return dates
}

// Format date to YYYY-MM-DD string
const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Get day of week (0 = Sunday, 6 = Saturday)
const getDayOfWeek = (date: Date): number => {
  return date.getDay()
}

// Get color intensity based on workout status
const getColorClass = (hasWorkedOut: boolean): string => {
  if (hasWorkedOut) {
    return 'bg-app-colors-300 hover:bg-app-colors-200'
  }
  return 'bg-app-colors-400 hover:bg-app-colors-200'
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

export const WorkoutStreakTracker = ({ data }: WorkoutStreakTrackerProps) => {
  const yearData = useMemo(() => {
    const dates = generateYearDates()
    const workoutMap = new Map<string, WorkoutTracker>()

    // Build map from data
    if (data) {
      data.forEach((workout) => {
        if (workout.date) {
          workoutMap.set(workout.date, workout)
        }
      })
    }

    // Group dates by week (for grid layout)
    const weeks: Date[][] = []
    let currentWeek: Date[] = []

    dates.forEach((date) => {
      const dayOfWeek = getDayOfWeek(date)

      // Start new week on Sunday
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentWeek.push(date)
    })

    // Push remaining week
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return { weeks, workoutMap }
  }, [data])

  // Calculate stats
  const totalWorkouts = data?.filter((w) => w.has_worked_out).length || 0
  const currentStreak = useMemo(() => {
    if (!data) return 0

    const workoutDates = new Set(
      data.filter((w) => w.has_worked_out && w.date).map((w) => w.date)
    )

    let streak = 0
    const todayDate = new Date()

    // Check if today or yesterday was a workout day
    const todayKey = formatDateKey(todayDate)
    const yesterdayDate = new Date(todayDate)
    yesterdayDate.setDate(yesterdayDate.getDate() - 1)
    const yesterdayKey = formatDateKey(yesterdayDate)

    if (!workoutDates.has(todayKey) && !workoutDates.has(yesterdayKey)) {
      return 0
    }

    // Count consecutive days
    const startDate = workoutDates.has(todayKey) ? todayDate : yesterdayDate

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(startDate)
      checkDate.setDate(checkDate.getDate() - i)
      const checkKey = formatDateKey(checkDate)

      if (workoutDates.has(checkKey)) {
        streak++
      } else {
        break
      }
    }

    return streak
  }, [data])

  return (
    <Card className="w-full max-w-[1000px] bg-app-colors-500 border-app-colors-400">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-neutral-50">Workout Activity</CardTitle>
            <CardDescription className="text-neutral-400">
              {totalWorkouts} workouts in the last year
            </CardDescription>
          </div>
          <div className="flex gap-6 text-neutral-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-app-colors-300">
                {currentStreak}
              </div>
              <div className="text-xs text-neutral-400">Current Streak</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex">
            {/* Day labels - hidden on mobile */}
            <div className="hidden sm:flex flex-col gap-[2px] mr-2 pt-4">
              {DAY_LABELS.map((day, index) => (
                <div
                  key={index}
                  className="h-3 text-xs text-neutral-400 flex items-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grid container */}
            <div className="flex flex-col">
              {/* Month labels row */}
              <div className="flex gap-px sm:gap-[2px] mb-1">
                {yearData.weeks.map((week, weekIndex) => {
                  const firstDay = week[0]
                  if (!firstDay) return null

                  const currentMonth = firstDay.getMonth()
                  const prevWeek = yearData.weeks[weekIndex - 1]
                  const prevMonth = prevWeek?.[0]?.getMonth()
                  const isNewMonth =
                    weekIndex === 0 || currentMonth !== prevMonth

                  return (
                    <div
                      key={weekIndex}
                      className="w-2 sm:w-3 text-[8px] sm:text-[10px] text-neutral-400 text-center leading-4"
                    >
                      {isNewMonth ? MONTH_LABELS[currentMonth] : ''}
                    </div>
                  )
                })}
              </div>

              {/* Contribution grid */}
              <div className="flex gap-px sm:gap-[2px]">
                {yearData.weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex flex-col gap-px sm:gap-[2px]"
                  >
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const date = week[dayIndex]

                      if (!date) {
                        return (
                          <div
                            key={dayIndex}
                            className="h-2 w-2 sm:h-3 sm:w-3"
                          />
                        )
                      }

                      const dateKey = formatDateKey(date)
                      const workout = yearData.workoutMap.get(dateKey)
                      const hasWorkedOut = workout?.has_worked_out ?? false

                      return (
                        <div
                          key={dayIndex}
                          className={`h-2 w-2 sm:h-3 sm:w-3 rounded-sm transition-colors cursor-pointer ${getColorClass(
                            hasWorkedOut
                          )}`}
                          title={`${date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}${hasWorkedOut ? ' - Workout completed' : ''}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 mt-4 text-[10px] sm:text-xs text-neutral-400">
            <span>No Workout</span>
            <div className="flex gap-px sm:gap-[2px]">
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-sm bg-app-colors-400" />
              <div className="h-2 w-2 sm:h-3 sm:w-3 rounded-sm bg-app-colors-300" />
            </div>
            <span>Workout Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
