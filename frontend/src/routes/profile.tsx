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

  //const data = {
  //  workout_streak_tracker: null
  //}

  return (
    <div className="flex flex-col justify-center items-center pt-32 gap-6 pb-24">
      <NextWorkout data={data?.active_program} />
      <WorkoutStreakTracker data={data?.workout_streak_tracker} />
      <ProgramsList />
    </div>
  )
}
