import { useState, memo, ReactElement } from 'react'
import clsx from 'clsx'
import { cn } from '@/lib/utils'
import { Trash2, Power } from 'lucide-react'
import { setProgramActive, deleteProgram } from '@/services/programsAPI'
import { WorkoutProgram } from '@/types/programCreation'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  iconButtonClass,
  panelClass,
  panelHeaderClass,
  panelTitleClass,
  skeletonClass
} from './profileStyles'

interface ProgramRowProps {
  program: WorkoutProgram
  isActive: boolean
  setActive: (program: WorkoutProgram) => Promise<boolean>
  deleteProgram: (programId: string) => Promise<boolean>
}

interface ProgramsListProps {
  programs: WorkoutProgram[] | null
  activeProgram: WorkoutProgram[] | null
  refreshProgramsList: () => void
  isLoading?: boolean
}

interface ProgramActiveResponse {
  message: string
  program_id: string
  status: number
}

export const ProgramRow = memo((props: ProgramRowProps): ReactElement => {
  const [isActivating, setIsActivating] = useState(false)
  const [activateError, setActivateError] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const dayCount = props.program.program_structure.length

  const handleSetActive = async () => {
    setIsActivating(true)
    setActivateError(false)
    const activated = await props.setActive(props.program)
    setIsActivating(false)
    if (!activated) setActivateError(true)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setDeleteError(false)
    const deleted = await props.deleteProgram(props.program.id)
    setIsDeleting(false)
    if (deleted) setDialogOpen(false)
    else setDeleteError(true)
  }

  return (
    <li className="flex min-h-[4.5rem] items-center gap-3 px-4 py-3 sm:px-6">
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-medium leading-snug text-neutral-50">
          {props.program.program_name}
        </p>
        <p className="mt-0.5 text-sm text-neutral-400">
          {props.isActive && (
            <span className="font-medium text-app-colors-300">Active · </span>
          )}
          {dayCount} {dayCount === 1 ? 'day' : 'days'} a week
        </p>
        {activateError && (
          <p role="alert" className="mt-1 text-sm text-red-400">
            Couldn&rsquo;t set this as active. Try again.
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleSetActive}
          disabled={props.isActive || isActivating}
          aria-pressed={props.isActive}
          aria-label={
            props.isActive
              ? `${props.program.program_name} is your active program`
              : `Set ${props.program.program_name} as active`
          }
          title={props.isActive ? 'Active program' : 'Set as active'}
          className={cn(
            iconButtonClass,
            'text-neutral-500 hover:text-neutral-300',
            props.isActive && 'disabled:opacity-100'
          )}
        >
          <Power
            aria-hidden
            className={cn(
              'transition-[color,filter] duration-200 ease-out-strong',
              props.isActive &&
                'text-app-colors-300 [filter:brightness(1.15)_drop-shadow(0_0_2px_rgba(148,234,67,0.9))_drop-shadow(0_0_8px_rgba(148,234,67,0.6))]',
              isActivating && 'animate-pulse'
            )}
          />
        </button>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) setDeleteError(false)
          }}
        >
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={`Delete ${props.program.program_name}`}
              title="Delete program"
              className={cn(
                iconButtonClass,
                'hover:bg-red-500/10 hover:text-red-400'
              )}
            >
              <Trash2 aria-hidden />
            </button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-lg border-neutral-800 bg-[#141414]">
            <DialogHeader className="text-left">
              <DialogTitle className="text-neutral-50">
                Delete this program?
              </DialogTitle>
              <DialogDescription className="text-neutral-400">
                &ldquo;{props.program.program_name}&rdquo; will be removed from
                your saved programs. This can&rsquo;t be undone.
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <p role="alert" className="text-sm text-red-400">
                Couldn&rsquo;t delete the program. Check your connection and try
                again.
              </p>
            )}
            <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:gap-0">
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="h-10 text-neutral-300 hover:bg-neutral-800/70 hover:text-neutral-50"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-10 bg-red-600 text-red-50 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-red-500 active:scale-[0.97]"
              >
                {isDeleting ? 'Deleting...' : 'Delete program'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  )
})

ProgramRow.displayName = 'ProgramRow'

const ProgramsSkeleton = () => (
  <ul aria-hidden className="divide-y divide-neutral-800">
    {Array.from({ length: 3 }).map((_, index) => (
      <li key={index} className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <div className="flex-1">
          <div className={clsx(skeletonClass, 'h-4 w-2/5')} />
          <div className={clsx(skeletonClass, 'mt-2 h-3 w-24')} />
        </div>
        <div className={clsx(skeletonClass, 'size-8')} />
        <div className={clsx(skeletonClass, 'size-8')} />
      </li>
    ))}
  </ul>
)

export const ProgramsList = (props: ProgramsListProps): ReactElement => {
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(
    null
  )

  const activeProgramId =
    optimisticActiveId ?? props.activeProgram?.[0]?.id ?? null
  const programCount = props.programs?.length ?? 0

  const handleSetActive = async (program: WorkoutProgram) => {
    try {
      const response = await setProgramActive(program)
      if (response && (response as ProgramActiveResponse).status === 201) {
        setOptimisticActiveId(response.program_id)
        props.refreshProgramsList()
        return true
      }
      return false
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const handleDeleteProgram = async (programId: string) => {
    try {
      await deleteProgram(programId)
      props.refreshProgramsList()
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return (
    <section aria-labelledby="programs-title" className={panelClass}>
      <div className={panelHeaderClass}>
        <h2 id="programs-title" className={panelTitleClass}>
          Saved programs
        </h2>
        {!props.isLoading && programCount > 0 && (
          <span className="text-sm tabular-nums text-neutral-400">
            {programCount}
          </span>
        )}
      </div>

      {props.isLoading ? (
        <ProgramsSkeleton />
      ) : programCount === 0 ? (
        <div className="px-4 py-8 sm:px-6">
          <p className="font-medium text-neutral-100">No saved programs</p>
          <p className="mt-1 max-w-[42ch] text-sm leading-relaxed text-neutral-400">
            Programs you save from the generator appear here. Set one as active
            to see your next workout.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-800">
          {props.programs?.map((program: WorkoutProgram) => (
            <ProgramRow
              program={program}
              key={program.id}
              isActive={program.id === activeProgramId}
              setActive={handleSetActive}
              deleteProgram={handleDeleteProgram}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
