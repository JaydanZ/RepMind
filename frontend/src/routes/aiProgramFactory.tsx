import { createFileRoute } from '@tanstack/react-router'
import { ProgramFactory } from '@/components/programFactory/ProgramFactory'
import { ProgramResult } from '@/components/programFactory/ProgramResult'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export const Route = createFileRoute('/aiProgramFactory')({
  component: RouteComponent
})

function RouteComponent() {
  const programResult = useSelector(
    (state: RootState) => state.programGeneration.aiProgram
  )

  console.log(programResult)
  return (
    <div className="flex h-dvh justify-center items-center">
      {!programResult && <ProgramFactory />}
      {programResult && <ProgramResult />}
    </div>
  )
}
