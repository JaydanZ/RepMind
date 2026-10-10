import { createFileRoute, redirect } from '@tanstack/react-router'
import { ChangePassword } from '@/components/auth/ChangePassword'

export const Route = createFileRoute('/changePassword')({
  component: RouteComponent,
  beforeLoad: async () => {
    const tokenInStore = await cookieStore.get('auth_token')
    const userToken = tokenInStore ? tokenInStore?.value : null
    if (!userToken) {
      throw redirect({
        to: '/login'
      })
    }
  }
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full max-w-[1920px] h-dvh justify-center items-center px-4">
      <ChangePassword />
    </div>
  )
}
