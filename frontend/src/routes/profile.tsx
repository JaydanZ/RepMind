import { createFileRoute } from '@tanstack/react-router'
import { useGetProfileDataQuery } from '@/services/protectedRoutesAPI'
import { WorkoutStreakTracker } from '@/components/profile/WorkoutStreakTracker'
import { ProgramsList } from '@/components/profile/ProgramsList'
import { NextWorkout } from '@/components/profile/NextWorkout'

export const Route = createFileRoute('/profile')({
  component: RouteComponent
})

function RouteComponent() {
  const { data } = useGetProfileDataQuery()

  const test_data = null

  //const data = {
  //  workout_streak_tracker: null
  //}

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center max-w-[1000px] w-full pt-32 gap-6 pb-24 pl-12 pr-12">
        <NextWorkout data={test_data} />
        <WorkoutStreakTracker data={test_data} />
        <ProgramsList programs={data ? data.programs : null} />
      </div>
    </div>
  )
}
