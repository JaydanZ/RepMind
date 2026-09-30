import { memo, useState } from 'react'
import clsx from 'clsx'
import { useGetWorkoutHistoryQuery } from '@/services/protectedRoutesAPI'
import { WorkoutHistoryEntry } from '@/types/workoutSession'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  panelClass,
  panelHeaderClass,
  panelTitleClass,
  skeletonClass
} from '../profile/profileStyles'
import {
  countSets,
  dateTile,
  formatSet,
  HISTORY_MAX_ITEMS,
  HISTORY_PAGE_SIZE,
  pluralize
} from './workoutHistory'

const ghostButtonClass =
  'h-10 border border-neutral-700 px-4 text-sm font-medium text-neutral-200 transition-[transform,background-color,color] duration-150 ease-out-strong hover:bg-neutral-800/70 hover:text-neutral-50 active:scale-[0.97] disabled:opacity-40'

const contentInsetClass = 'sm:pl-[5.5rem]'

const HistorySkeleton = () => (
  <ul aria-busy="true" aria-label="Loading previous workouts">
    {Array.from({ length: 3 }).map((_, index) => (
      <li
        key={index}
        className="flex min-h-[4.5rem] items-center gap-3 border-t border-neutral-800 px-4 py-3 first:border-t-0 sm:gap-4 sm:px-6"
      >
        <div className={clsx(skeletonClass, 'h-12 w-12 rounded-md')} />
        <div className="flex-1">
          <div className={clsx(skeletonClass, 'h-4 w-2/5')} />
          <div className={clsx(skeletonClass, 'mt-2 h-3 w-3/5')} />
        </div>
        <div className={clsx(skeletonClass, 'h-4 w-12')} />
      </li>
    ))}
  </ul>
)

const WorkoutRow = memo(({ workout }: { workout: WorkoutHistoryEntry }) => {
  const tile = dateTile(workout.date)
  const setCount = countSets(workout)
  const title = workout.focus || workout.day || 'Workout'
  const meta = [workout.focus ? workout.day : null, workout.program_name]
    .filter(Boolean)
    .join(' / ')

  return (
    <AccordionItem
      value={workout.id}
      className="border-b-0 border-t border-neutral-800 first:border-t-0"
    >
      <AccordionTrigger className="group min-h-[4.5rem] min-w-0 gap-3 px-4 py-3 outline-none transition-colors hover:no-underline focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-app-colors-300 sm:gap-4 sm:px-6 [&>svg]:size-[1.125rem] [&>svg]:text-neutral-500 [&[data-state=open]>svg]:text-app-colors-300">
        <span
          aria-hidden
          className="flex size-12 shrink-0 flex-col items-center justify-center rounded-md border border-neutral-800 bg-neutral-900/70 leading-none transition-colors duration-150 group-data-[state=open]:border-app-colors-300/40"
        >
          <span className="text-[0.6875rem] font-medium text-neutral-500">
            {tile.month}
          </span>
          <span className="mt-1 text-lg font-semibold tabular-nums text-neutral-50">
            {tile.day}
          </span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="sr-only">{tile.label}: </span>
          <span className="block truncate text-[0.9375rem] font-medium leading-snug text-neutral-50">
            {title}
          </span>
          {meta && (
            <span className="mt-0.5 block truncate text-sm font-normal text-neutral-400">
              {meta}
            </span>
          )}
        </span>

        <span className="flex shrink-0 flex-col items-end gap-1 text-right">
          <span className="text-sm font-medium tabular-nums text-neutral-300">
            {pluralize(setCount, 'set')}
          </span>
          {!workout.is_completed && (
            <span className="text-xs font-normal text-neutral-500">
              Finished early
            </span>
          )}
        </span>
      </AccordionTrigger>

      <AccordionContent
        className={clsx('px-4 pb-5 sm:px-6', contentInsetClass)}
      >
        {workout.exercises.length === 0 ? (
          <p className="text-sm text-neutral-400">No sets were logged.</p>
        ) : (
          <ol className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <li key={`${exercise.name}-${index}`}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="min-w-0 text-sm font-medium text-neutral-100">
                    {exercise.name}
                  </p>
                  <p className="shrink-0 text-xs tabular-nums text-neutral-500">
                    {pluralize(exercise.sets.length, 'set')}
                  </p>
                </div>
                <ul
                  aria-label={`${exercise.name} sets`}
                  className="mt-2 flex flex-wrap gap-1.5"
                >
                  {exercise.sets.map((set) => (
                    <li
                      key={set.set_number}
                      className="rounded-md border border-neutral-800 bg-neutral-900/70 px-2 py-1 text-xs tabular-nums text-neutral-300"
                    >
                      <span className="sr-only">Set {set.set_number}: </span>
                      {formatSet(set)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </AccordionContent>
    </AccordionItem>
  )
})

WorkoutRow.displayName = 'WorkoutRow'

export const PreviousWorkouts = () => {
  const [limit, setLimit] = useState(HISTORY_PAGE_SIZE)
  const [openItem, setOpenItem] = useState('')
  const { data, isLoading, isError, isFetching, refetch } =
    useGetWorkoutHistoryQuery({ limit })

  const workouts = data?.workouts ?? []
  const canLoadMore = Boolean(data?.has_more) && limit < HISTORY_MAX_ITEMS

  return (
    <section aria-labelledby="previous-workouts-title" className={panelClass}>
      <div className={panelHeaderClass}>
        <h2 id="previous-workouts-title" className={panelTitleClass}>
          Previous workouts
        </h2>
      </div>

      {isLoading ? (
        <HistorySkeleton />
      ) : isError && workouts.length === 0 ? (
        <div role="alert" className="px-4 py-8 sm:px-6">
          <p className="font-medium text-neutral-50">
            We couldn&rsquo;t load your workouts
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            Check your connection, then try again.
          </p>
          <Button
            variant="ghost"
            onClick={() => refetch()}
            disabled={isFetching}
            className={clsx(ghostButtonClass, 'mt-4')}
          >
            {isFetching ? 'Retrying...' : 'Try again'}
          </Button>
        </div>
      ) : workouts.length === 0 ? (
        <div className="px-4 py-8 sm:px-6">
          <p className="font-medium text-neutral-100">No workouts logged yet</p>
          <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-neutral-400">
            Finish a session from Next workout and it will show up here with
            every set you logged.
          </p>
        </div>
      ) : (
        <>
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
          >
            {workouts.map((workout) => (
              <WorkoutRow key={workout.id} workout={workout} />
            ))}
          </Accordion>

          {(canLoadMore || isError) && (
            <div className="flex flex-col items-stretch gap-2 border-t border-neutral-800 px-4 py-4 sm:items-center sm:px-6">
              {isError && (
                <p role="alert" className="text-sm text-red-400">
                  Couldn&rsquo;t load more workouts. Try again.
                </p>
              )}
              <Button
                variant="ghost"
                disabled={isFetching}
                onClick={() =>
                  isError
                    ? refetch()
                    : setLimit((current) =>
                        Math.min(current + HISTORY_PAGE_SIZE, HISTORY_MAX_ITEMS)
                      )
                }
                className={ghostButtonClass}
              >
                {isFetching ? 'Loading...' : 'Show older workouts'}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
