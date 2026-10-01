import { createFileRoute } from '@tanstack/react-router'
import { ProgramFactory } from '@/components/programFactory/ProgramFactory'
import { ProgramResult } from '@/components/programFactory/ProgramResult'
import { ProgramLoadingScreen } from '@/components/programFactory/ProgramLoadingScreen'
import { ProgramGenerationError } from '@/features/programGeneration/programGenerationSlice'
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

  const programGenerationError = useSelector(
    (state: RootState) => state.programGeneration.error
  )

  // Handle program generation limit
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  const limitProgramGen = !isLoggedIn && getExpireTime() ? true : false

  const rateLimitReached =
    programGenerationError &&
    (programGenerationError as ProgramGenerationError).errorCode === 429
      ? true
      : false

  const displayProgramFactory =
    !programResult && !isLoading && !limitProgramGen && !rateLimitReached
      ? true
      : false

  const displayRateLimit =
    !programResult && !isLoading && (limitProgramGen || rateLimitReached)

  return (
    <div
      className={clsx(
        'flex justify-center px-4 pt-8 pb-32 min-[800px]:px-0 min-[800px]:pt-[90px] min-[800px]:pb-0',
        programResult && !isLoading
          ? 'items-start h-max'
          : 'items-center min-h-dvh'
      )}
    >
      {displayProgramFactory && <ProgramFactory />}
      {displayRateLimit && (
        <LimitReachedDisplay authLimitReached={isLoggedIn} />
      )}
      {isLoading && <ProgramLoadingScreen />}
      {programResult && !isLoading && <ProgramResult />}
    </div>
  )
}
