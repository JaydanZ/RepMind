import { useState, memo } from 'react'
import { Card, CardTitle, CardDescription, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { setProgramActive } from '@/services/programsAPI'
import { WorkoutProgram } from '@/types/programCreation'
import { ReactElement } from 'react'

interface ProgramRowProps {
  program: WorkoutProgram
  isActive: boolean
  setActive: (program: WorkoutProgram) => void
}

interface ProgramsListProps {
  programs: WorkoutProgram[] | null
  activeProgram: WorkoutProgram[] | null
}

interface ProgramActiveResponse {
  message: string
  program_id: string
  status: number
}

export const ProgramRow = memo((props: ProgramRowProps): ReactElement => {
  const handleDeleteProgram = async () => {}

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
                <div>Active</div>
              ) : (
                <Button
                  variant="default"
                  onClick={() => props.setActive(props.program)}
                >
                  Set as Active
                </Button>
              )}
            </div>
            <div className="flex justify-center items-center">
              <Button
                variant="ghost"
                className="px-1 text-red-800 hover:text-red-500"
                onClick={handleDeleteProgram}
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
})

ProgramRow.displayName = 'ProgramRow'

export const ProgramsList = (props: ProgramsListProps): ReactElement => {
  const [activeProgramId, setActiveProgramId] = useState<string | null>(
    props.activeProgram ? props.activeProgram[0].id : null
  )
  const handleSetActive = async (program: WorkoutProgram) => {
    try {
      const response = await setProgramActive(program)
      if (response && (response as ProgramActiveResponse).status === 201)
        setActiveProgramId(response.program_id)
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
          />
        ))}
    </div>
  )
}
