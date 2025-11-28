import { createFileRoute } from '@tanstack/react-router'
import { useGetProfileDataQuery } from '@/services/protectedRoutesAPI'

export const Route = createFileRoute('/profile')({
  component: RouteComponent
})

function RouteComponent() {
  const { data } = useGetProfileDataQuery()

  return (
    <div className="flex justify-center items-center pt-32">
      <div className="text-white text-2rem">{JSON.stringify(data)}</div>
    </div>
  )
}
