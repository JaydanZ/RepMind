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

  return (
    <div className="flex flex-col justify-center items-center pt-32">
      <div className="text-white text-2rem">{JSON.stringify(data)}</div>
      <NextWorkout />
      <WorkoutStreakTracker />
      <ProgramsList />
    </div>
  )
}
