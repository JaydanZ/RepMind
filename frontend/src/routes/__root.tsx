import {
  Outlet,
  createRootRoute,
  Link,
  useNavigate,
  useRouterState
} from '@tanstack/react-router'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useAsyncDispatch } from '@/store/store'
import { userLogout } from '@/features/auth/authSlice'

import useIsMobile from '@/hooks/useIsMobile'
import { LOGGED_IN_ROUTES, LOGGED_OUT_ROUTES } from '@/data/routesData'
import clsx from 'clsx'
import { Button } from '@/components/ui/button'

interface MobileNavRoute {
  id: string
  href?: string
  icon: React.ReactNode
  params: object
}

interface MobileNavProps {
  routes: MobileNavRoute[]
  onLogout: () => void
}

export const Route = createRootRoute({
  component: RootComponent
})

function MobileNav({ routes, onLogout }: MobileNavProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const activeIndex = routes.findIndex((route) =>
    route.href === '/'
      ? pathname === '/'
      : !!route.href && pathname.startsWith(route.href)
  )

  const itemClass =
    'group relative flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl outline-none select-none [-webkit-tap-highlight-color:transparent] transition-[color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-colors-300/60 motion-reduce:active:scale-100 [&_svg]:size-[22px] [&_svg]:shrink-0'

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-neutral-800/80 bg-app-colors-500 pb-[max(env(safe-area-inset-bottom),0.5rem)] supports-[backdrop-filter]:bg-app-colors-500/80 supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150"
    >
      <div
        className="relative mx-auto grid max-w-md px-2 pt-1"
        style={{
          gridTemplateColumns: `repeat(${routes.length}, minmax(0, 1fr))`
        }}
      >
        <span
          aria-hidden
          className={clsx(
            'pointer-events-none absolute -top-px left-2 flex h-[2px] justify-center transition-[transform,opacity] duration-300 ease-out-strong motion-reduce:transition-opacity',
            activeIndex === -1 && 'opacity-0'
          )}
          style={{
            width: `calc((100% - 1rem) / ${routes.length})`,
            transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`
          }}
        >
          <span className="h-full w-7 rounded-full bg-app-colors-300" />
        </span>

        {routes.map((route, index) => {
          const isActive = index === activeIndex
          const content = (
            <>
              <span
                className={clsx(
                  'transition-colors duration-150',
                  isActive
                    ? 'text-app-colors-300'
                    : 'text-neutral-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-neutral-300'
                )}
              >
                {route.icon}
              </span>
              <span
                className={clsx(
                  'max-w-full truncate px-0.5 text-[11px] font-medium leading-none tracking-[0.01em] transition-colors duration-150',
                  isActive
                    ? 'text-neutral-50'
                    : 'text-neutral-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-neutral-300'
                )}
              >
                {route.id}
              </span>
            </>
          )

          return route.href ? (
            <Link
              key={route.id}
              to={route.href}
              params={route.params}
              aria-current={isActive ? 'page' : undefined}
              className={itemClass}
            >
              {content}
            </Link>
          ) : (
            <button
              key={route.id}
              type="button"
              onClick={onLogout}
              className={itemClass}
            >
              {content}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function RootComponent() {
  const navigate = useNavigate()

  const dispatch = useAsyncDispatch()
  const authStatus = useSelector((state: RootState) => state.auth.userToken)
  const authErrors = useSelector((state: RootState) => state.auth.error)
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    try {
      // Dispatch user logout reducer
      await dispatch(userLogout())

      if (!authErrors) {
        // If successful, redirect user to home page
        navigate({ to: '/' })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="relative min-h-dvh h-max bg-app-colors-500 z-50">
      {isMobile ? (
        <MobileNav
          routes={authStatus ? LOGGED_IN_ROUTES : LOGGED_OUT_ROUTES}
          onLogout={handleLogout}
        />
      ) : (
        <nav className="flex flex-nowrap fixed top-0 z-50 w-full items-center justify-between bg-app-colors-500 py-6">
          {/* DESKTOP VIEW */}
          {/* Left elements */}
          <ul className="flex flex-row list-style-none me-auto pl-12">
            <li className="text-app-colors-300 font-main-font font-medium text-[1.5rem]">
              RepMind
            </li>
          </ul>
          {/* Right elements */}
          <div className="flex flex-row items-center pr-12 gap-12">
            {authStatus
              ? LOGGED_IN_ROUTES.map((route, key) => (
                  <>
                    {route.href ? (
                      <Link to={route.href} key={key} params={route.params}>
                        <Button variant="ghost" size="lg" className="p-0">
                          {route.icon}
                          {route.id}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="ghost"
                        size="lg"
                        key={key}
                        className="flex flex-row p-0"
                        onClick={handleLogout}
                      >
                        {route.icon}
                        {route.id}
                      </Button>
                    )}
                  </>
                ))
              : LOGGED_OUT_ROUTES.map((route, key) => (
                  <Link to={route.href} key={key} params={route.params}>
                    <Button variant="ghost" size="lg" className="p-0">
                      {route.icon}
                      {route.id}
                    </Button>
                  </Link>
                ))}
          </div>
        </nav>
      )}
      <Outlet />
    </div>
  )
}
