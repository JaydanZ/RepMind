import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex w-full h-dvh justify-center items-center">
      <label className="text-app-colors-500 font-medium text-[3rem] font-main-font">
        RepMind.
      </label>
    </div>
  )
}
