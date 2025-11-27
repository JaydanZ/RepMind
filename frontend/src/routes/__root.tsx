import {
  Outlet,
  createRootRoute,
  Link,
  useNavigate
} from '@tanstack/react-router'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useAsyncDispatch } from '@/store/store'
import { userLogout } from '@/features/auth/authSlice'

import useIsMobile from '@/hooks/useIsMobile'
import { LOGGED_IN_ROUTES, LOGGED_OUT_ROUTES } from '@/data/routesData'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
  const navigate = useNavigate()

  const dispatch = useAsyncDispatch()
  const authStatus = useSelector((state: RootState) => state.auth.userToken)
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    // Dispatch user logout reducer
    await dispatch(userLogout())

    // If successful, redirect user to home page
    navigate({ to: '/' })
  }

  return (
    <div className="relative min-h-dvh bg-app-colors-500">
      {isMobile ? (
        <nav
          className={clsx(
            'flex flex-row fixed bottom-0 w-full z-100 bg-app-colors-500 pb-8',
            authStatus ? 'justify-evenly' : 'justify-center'
          )}
        >
          {authStatus
            ? LOGGED_IN_ROUTES.map((route, key) => (
                <>
                  {route.href ? (
                    <Button
                      variant="ghost"
                      size="lg"
                      key={key}
                      className="flex flex-col"
                    >
                      {route.icon}
                      <Link to={route.href} params={route.params}>
                        {route.id}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="lg"
                      key={key}
                      className="flex flex-col"
                      onClick={handleLogout}
                    >
                      {route.icon}
                      {route.id}
                    </Button>
                  )}
                </>
              ))
            : LOGGED_OUT_ROUTES.map((route, key) => (
                <Button
                  variant="ghost"
                  size="lg"
                  key={key}
                  className="flex flex-col"
                >
                  {route.icon}
                  <Link to={route.href} params={route.params}>
                    {route.id}
                  </Link>
                </Button>
              ))}
        </nav>
      ) : (
        <nav className="flex flex-nowrap fixed top-0 z-100 w-full items-center justify-between bg-app-colors-500 py-6">
          {/* Left elements */}
          <ul className="flex flex-row list-style-none me-auto pl-12">
            <li className="text-app-colors-300 font-main-font font-medium text-[1.5rem]">
              RepMind
            </li>
          </ul>
          {/* Right elements */}
          <div className="flex flex-row items-center pr-12">
            {authStatus
              ? LOGGED_IN_ROUTES.map((route, key) => (
                  <>
                    {route.href ? (
                      <Button
                        variant="ghost"
                        size="lg"
                        key={key}
                        className="ml-8"
                      >
                        {route.icon}
                        {route.href && (
                          <Link to={route.href} params={route.params}>
                            {route.id}
                          </Link>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="lg"
                        key={key}
                        className="flex flex-row"
                        onClick={handleLogout}
                      >
                        {route.icon}
                        {route.id}
                      </Button>
                    )}
                  </>
                ))
              : LOGGED_OUT_ROUTES.map((route, key) => (
                  <Button variant="ghost" size="lg" key={key} className="ml-8">
                    {route.icon}
                    <Link to={route.href} params={route.params}>
                      {route.id}
                    </Link>
                  </Button>
                ))}
          </div>
        </nav>
      )}
      <Outlet />
    </div>
  )
}
