import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent
})

function RootComponent() {
  return (
    <div className="relative min-h-dvh bg-app-colors-100">
      <Outlet />
    </div>
  )
}
