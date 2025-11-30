import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent() {
  const navigate = useNavigate()

  const handleCTAClick = () => {
    navigate({ to: '/aiProgramFactory' })
  }
  return (
    <div className="flex flex-col w-full h-dvh justify-center items-center">
      <label className="text-white text-[3rem] font-normal">
        Reps and workouts, guided by AI Intelligence
      </label>
      <label className="text-neutral-500 text-[2rem] font-light italic py-4">
        Try it out!
      </label>
      <Button variant="default" size="lg" onClick={handleCTAClick}>
        Generate a Program
      </Button>
    </div>
  )
}
