import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/components/auth/ForgotPassword'

export const Route = createFileRoute('/forgotPassword')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full max-w-[1920px] h-dvh justify-center items-center px-4">
      <ForgotPassword />
    </div>
  )
}
