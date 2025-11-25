import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex w-full h-dvh justify-center items-center">
      <label className="text-white font-bold text-[3rem]">RepMind.</label>
    </div>
  )
}
