import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader
} from '../ui/card'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { setProgramActive } from '@/services/programsAPI'
import { WorkoutProgram } from '@/types/programCreation'
import { ReactElement } from 'react'

interface ProgramRowProps {
  program: WorkoutProgram
  isActive: boolean
}

export const ProgramRow = (props: ProgramRowProps): ReactElement => {
  const handleSetActive = () => {}

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
                <Button variant="default">Set as Active</Button>
              )}
            </div>
            <div className="flex justify-center items-center">
              <Button
                variant="ghost"
                className="px-1 text-red-800 hover:text-red-500"
              >
                <Trash />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

export const ProgramsList = ({ programs, activeProgram }) => {
  console.log(programs)
  return (
    <div className="w-full max-w-[1000px] flex flex-col">
      {programs &&
        programs.map((program: WorkoutProgram, index: number) => (
          <ProgramRow
            program={program}
            key={index}
            isActive={
              activeProgram.length > 0
                ? activeProgram[0].id === program.id
                  ? true
                  : false
                : false
            }
          />
        ))}
    </div>
  )
}
