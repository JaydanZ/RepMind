import { useState, memo } from 'react'
import { Card, CardTitle, CardDescription, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Trash, Power } from 'lucide-react'
import { setProgramActive, deleteProgram } from '@/services/programsAPI'
import { WorkoutProgram } from '@/types/programCreation'
import { ReactElement } from 'react'
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

interface ProgramRowProps {
  program: WorkoutProgram
  isActive: boolean
  setActive: (program: WorkoutProgram) => void
  deleteProgram: (programId: string) => void
}

interface ProgramsListProps {
  programs: WorkoutProgram[] | null
  activeProgram: WorkoutProgram[] | null
  refreshProgramsList: () => void
}

interface ProgramActiveResponse {
  message: string
  program_id: string
  status: number
}

export const ProgramRow = memo((props: ProgramRowProps): ReactElement => {
  return (
    <Card className="w-full max-w-[1000px] bg-app-colors-500 border-app-colors-400 mt-1 mb-1">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-neutral-50">
              {props.program.program_name}
            </CardTitle>
            <CardDescription className="text-neutral-400">
              {`${props.program.program_structure.length} days a week`}
            </CardDescription>
          </div>
          <div className="flex gap-6 text-neutral-50">
            <div className="text-center">
              {props.isActive ? (
                <div className="flex justify-center items-center text-app-colors-300 py-2 px-4 gap-2">
                  <Power className="[filter:drop-shadow(0_0_15px_rgba(134,234,67,1))_drop-shadow(0_0_5px_rgba(134,234,67,1))]" />
                </div>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => props.setActive(props.program)}
                  className="text-neutral-600"
                >
                  <Power />
                </Button>
              )}
            </div>
            <div className="flex justify-center items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="px-1 text-red-800 hover:text-red-500"
                  >
                    <Trash />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Program</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this program?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      onClick={() => props.deleteProgram(props.program.id)}
                    >
                      Delete
                    </Button>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
})

ProgramRow.displayName = 'ProgramRow'

export const ProgramsList = (props: ProgramsListProps): ReactElement => {
  const [optimisticActiveId, setOptimisticActiveId] = useState<string | null>(
    null
  )

  const activeProgramId =
    optimisticActiveId ?? props.activeProgram?.[0]?.id ?? null

  const handleSetActive = async (program: WorkoutProgram) => {
    try {
      const response = await setProgramActive(program)
      if (response && (response as ProgramActiveResponse).status === 201)
        setOptimisticActiveId(response.program_id)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteProgram = async (programId: string) => {
    try {
      await deleteProgram(programId)
      props.refreshProgramsList()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full max-w-[1000px] flex flex-col">
      {props.programs &&
        props.programs.map((program: WorkoutProgram) => (
          <ProgramRow
            program={program}
            key={program.id}
            isActive={program.id === activeProgramId}
            setActive={handleSetActive}
            deleteProgram={handleDeleteProgram}
          />
        ))}
    </div>
  )
}
