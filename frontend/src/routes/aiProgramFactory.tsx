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

  // Handle program generation limit
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  const checkProgramGenUsage = () => {
    return localStorage.getItem('hasUsedProgramGen') ? true : false
  }

  const limitProgramGen = !isLoggedIn && checkProgramGenUsage() ? true : false

  return (
    <div className="flex h-dvh justify-center items-center pt-[90px]">
      {!programResult && !isLoading && !limitProgramGen && <ProgramFactory />}
      {!programResult && !isLoading && limitProgramGen && (
        <div>
          This feature can no longer be used. You must login to continue.
        </div>
      )}
      {isLoading && <ProgramLoadingScreen />}
      {programResult && !isLoading && <ProgramResult />}
    </div>
  )
}
