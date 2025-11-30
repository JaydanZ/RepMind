import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/aiProgramFactory')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello /aiProgramFactory!</div>
}
