import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
  return (
    <div className="relative min-h-dvh bg-app-colors-500">
      <nav className="flex flex-nowrap fixed top-0 z-100 w-full items-center justify-between bg-app-colors-500 py-6 px-12">
        {/* Left elements */}
        <ul className="flex flex-row list-style-none me-auto">
          <li className="text-app-colors-300 font-main-font font-medium text-[1.5rem]">
            RepMind
          </li>
        </ul>
        {/* Right elements */}
        <div className="flex flex-row items-center ">
          <Button variant="outline" className="text-app-colors-300">
            Login
          </Button>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}
