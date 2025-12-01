import { createFileRoute } from '@tanstack/react-router'
import { ProgramFactory } from '@/components/programFactory/ProgramFactory'

export const Route = createFileRoute('/aiProgramFactory')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex h-dvh justify-center items-center bg-app-colors-300">
      <ProgramFactory />
    </div>
  )
}
