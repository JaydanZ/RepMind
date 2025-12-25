import { createFileRoute } from '@tanstack/react-router'
import { ProgramFactory } from '@/components/programFactory/ProgramFactory'
import { ProgramResult } from '@/components/programFactory/ProgramResult'
import { ProgramLoadingScreen } from '@/components/programFactory/ProgramLoadingScreen'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export const Route = createFileRoute('/aiProgramFactory')({
  component: RouteComponent
})

function RouteComponent() {
  const programResult = useSelector(
    (state: RootState) => state.programGeneration.aiProgram
  )
  const isLoading = useSelector(
    (state: RootState) => state.programGeneration.loading
  )

  return (
    <div className="flex h-dvh justify-center items-center pt-[90px]">
      {!programResult && !isLoading && <ProgramFactory />}
      {isLoading && <ProgramLoadingScreen />}
      {programResult && !isLoading && <ProgramResult />}
    </div>
  )
}
