import { useState } from 'react'
import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import Hamburger from 'hamburger-react'
import useIsMobile from '@/hooks/useIsMobile'

export const Route = createRootRoute({
  component: RootComponent
})

const LOGGED_IN_ROUTES = [
  {
    id: 'My Workouts',
    href: '/userworkouts',
    params: {}
  },
  {
    id: 'Community',
    href: '/community',
    params: {}
  },
  {
    id: 'Logout',
    href: '/logout',
    params: {}
  }
]
const LOGGED_OUT_ROUTES = [
  {
    id: 'About',
    href: '/about',
    params: {}
  },
  {
    id: 'Login',
    href: '/login',
    params: {}
  }
]

function RootComponent() {
  const [isOpen, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const authStatus = {
    loggedIn: true
  }

  return (
    <div className="relative min-h-dvh bg-app-colors-500">
      <nav className="flex flex-nowrap fixed top-0 z-100 w-full items-center justify-between bg-app-colors-500 py-6">
        {/* Left elements */}
        <ul className="flex flex-row list-style-none me-auto pl-12">
          <li className="text-app-colors-300 font-main-font font-medium text-[1.5rem]">
            RepMind
          </li>
        </ul>
        {/* Right elements */}
        {isMobile ? (
          <>
            <div className="pr-12">
              <Hamburger toggled={isOpen} toggle={setOpen} />
            </div>
            {isOpen && (
              <div className="flex flex-col flex-wrap fixed top-24 w-full items-center z-100">
                {authStatus.loggedIn
                  ? LOGGED_IN_ROUTES.map((route, key) => (
                      <Button variant="default" size="lg" key={key}>
                        <Link to={route.href} params={route.params}>
                          {route.id}
                        </Link>
                      </Button>
                    ))
                  : LOGGED_OUT_ROUTES.map((route, key) => (
                      <Button variant="default" size="lg" key={key}>
                        <Link to={route.href} params={route.params}>
                          {route.id}
                        </Link>
                      </Button>
                    ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-row items-center pr-12">
            {authStatus.loggedIn
              ? LOGGED_IN_ROUTES.map((route, key) => (
                  <Button variant="default" size="lg" key={key}>
                    <Link to={route.href} params={route.params}>
                      {route.id}
                    </Link>
                  </Button>
                ))
              : LOGGED_OUT_ROUTES.map((route, key) => (
                  <Button variant="default" size="lg" key={key}>
                    <Link to={route.href} params={route.params}>
                      {route.id}
                    </Link>
                  </Button>
                ))}
          </div>
        )}
      </nav>
      <Outlet />
    </div>
  )
}
