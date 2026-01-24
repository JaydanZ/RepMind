import { createFileRoute } from '@tanstack/react-router'
import { ProgramFactory } from '@/components/programFactory/ProgramFactory'
import { ProgramResult } from '@/components/programFactory/ProgramResult'
import { ProgramLoadingScreen } from '@/components/programFactory/ProgramLoadingScreen'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { LimitReachedDisplay } from '@/components/programFactory/LimitReachedDisplay'
import { getExpireTime } from '@/services/programGenAPI'
import clsx from 'clsx'

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

  const limitProgramGen = !isLoggedIn && getExpireTime() ? true : false

  return (
    <div
      className={clsx(
        'flex justify-center pt-[90px]',
        programResult && !isLoading ? 'items-start h-max' : 'items-center h-dvh'
      )}
    >
      {!programResult && !isLoading && !limitProgramGen && <ProgramFactory />}
      {!programResult && !isLoading && limitProgramGen && (
        <LimitReachedDisplay />
      )}
      {isLoading && <ProgramLoadingScreen />}
      {programResult && !isLoading && <ProgramResult />}
    </div>
  )
}
