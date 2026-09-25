import {
  useState,
  useEffect,
  useRef,
  CSSProperties,
  KeyboardEvent
} from 'react'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { SAMPLE_WEEK } from '@/data/landingData'

// Row index drives the cascade delay so the week "writes itself" column by column on load
const cascade = (index: number) => ({ '--i': index }) as CSSProperties

// Tabs only exist below lg; at lg and up all four days render as columns
const useIsTabbed = () => {
  const [isTabbed, setIsTabbed] = useState(true)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)')
    const update = () => setIsTabbed(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return isTabbed
}

export const SampleWeek = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const isTabbed = useIsTabbed()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = SAMPLE_WEEK.length - 1
    const next =
      event.key === 'ArrowRight'
        ? selectedDay === last
          ? 0
          : selectedDay + 1
        : event.key === 'ArrowLeft'
          ? selectedDay === 0
            ? last
            : selectedDay - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    setSelectedDay(next)
    tabRefs.current[next]?.focus()
  }
  const [openTip, setOpenTip] = useState<string | null>(
    `${SAMPLE_WEEK[0].day}-0`
  )

  let rowIndex = 0

  return (
    <section
      aria-labelledby="sample-week-title"
      className="rounded-lg border border-neutral-800 bg-[#141414]"
    >
      <header className="flex flex-col gap-3 border-b border-neutral-800 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2
            id="sample-week-title"
            className="font-display text-lg font-semibold text-neutral-50"
          >
            Sample program
          </h2>
          <p className="text-sm text-neutral-400">
            Gain muscle, 4 days a week, 2 - 3 years experience
          </p>
        </div>
        <p className="text-sm text-neutral-400">
          Tap an exercise to see its coaching tip
        </p>
      </header>

      {/* Mobile: day tabs, mirroring the real program view */}
      <div
        role="tablist"
        aria-label="Training days"
        className="flex gap-1 border-b border-neutral-800 px-3 pt-3 lg:hidden"
      >
        {SAMPLE_WEEK.map((workout, index) => (
          <button
            key={workout.day}
            ref={(element) => {
              tabRefs.current[index] = element
            }}
            role="tab"
            id={`tab-${workout.day}`}
            aria-selected={index === selectedDay}
            tabIndex={index === selectedDay ? 0 : -1}
            onKeyDown={handleTabKeyDown}
            aria-controls={`day-${workout.day}`}
            onClick={() => setSelectedDay(index)}
            className={clsx(
              'relative flex-1 pb-3 pt-1 text-sm font-medium transition-colors duration-150',
              index === selectedDay
                ? 'text-app-colors-300'
                : 'text-neutral-400 hover:text-neutral-200'
            )}
          >
            {workout.day.substring(0, 3)}
            <span
              aria-hidden
              className={clsx(
                'absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-app-colors-300 transition-opacity duration-150',
                index === selectedDay ? 'opacity-100' : 'opacity-0'
              )}
            />
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-4 lg:divide-x lg:divide-neutral-800">
        {SAMPLE_WEEK.map((workout, dayIndex) => (
          <div
            key={workout.day}
            id={`day-${workout.day}`}
            role={isTabbed ? 'tabpanel' : undefined}
            aria-labelledby={isTabbed ? `tab-${workout.day}` : undefined}
            className={clsx(
              'flex-col px-5 py-5 md:px-6',
              dayIndex === selectedDay ? 'flex' : 'hidden lg:flex'
            )}
          >
            <div
              className="animate-write-in mb-4 hidden lg:block"
              style={cascade(rowIndex++)}
            >
              <p className="font-display text-2xl font-bold text-neutral-50">
                {workout.day}
              </p>
              <p className="text-sm text-app-colors-300">{workout.focus}</p>
            </div>
            <p className="mb-3 text-sm text-app-colors-300 lg:hidden">
              {workout.focus}
            </p>

            <ul className="flex flex-col">
              {workout.exercises.map((exercise, exerciseIndex) => {
                const tipId = `${workout.day}-${exerciseIndex}`
                const isOpen = openTip === tipId
                return (
                  <li
                    key={exercise.name}
                    className="animate-write-in border-t border-neutral-800/80 first:border-t-0"
                    style={cascade(rowIndex++)}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`tip-${tipId}`}
                      onClick={() => setOpenTip(isOpen ? null : tipId)}
                      className="group flex w-full items-center gap-3 rounded-sm py-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-app-colors-300"
                    >
                      <span className="flex-1 text-[0.9375rem] leading-snug text-neutral-100">
                        {exercise.name}
                      </span>
                      <span className="whitespace-nowrap text-sm tabular-nums text-neutral-400">
                        {exercise.sets} &times; {exercise.reps}
                      </span>
                      <Plus
                        aria-hidden
                        className={clsx(
                          'size-4 shrink-0 text-neutral-500 transition-transform duration-200 ease-out-strong group-hover:text-app-colors-300',
                          isOpen && 'rotate-45 text-app-colors-300'
                        )}
                      />
                    </button>
                    <div
                      id={`tip-${tipId}`}
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
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
