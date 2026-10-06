import { useState, ReactElement } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAsyncDispatch } from '@/store/store'
import { userLogout } from '@/features/auth/authSlice'
import { Spinner } from '@/components/ui/spinner'
import { panelClass, panelTitleClass } from './profileStyles'

const logoutButtonClass =
  'inline-flex h-12 w-full select-none items-center justify-center gap-2 rounded-md border border-red-500/25 bg-red-500/[0.06] px-5 text-sm font-semibold text-red-300 transition-[transform,background-color,border-color,color] duration-150 ease-out-strong [-webkit-tap-highlight-color:transparent] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] disabled:pointer-events-none [@media(hover:hover)_and_(pointer:fine)]:hover:border-red-400/50 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-red-500/10 [@media(hover:hover)_and_(pointer:fine)]:hover:text-red-200 sm:h-10 sm:w-auto sm:min-w-[8.5rem] [&_svg]:size-4 [&_svg]:shrink-0'

export const SessionPanel = (): ReactElement => {
  const dispatch = useAsyncDispatch()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setLogoutError(false)
    const result = await dispatch(userLogout())
    if (userLogout.fulfilled.match(result)) {
      navigate({ to: '/' })
      return
    }
    setIsLoggingOut(false)
    setLogoutError(true)
  }

  return (
    <section aria-labelledby="session-title" className={panelClass}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2 id="session-title" className={panelTitleClass}>
            Session
          </h2>
          <p className="mt-1 max-w-[46ch] text-sm leading-relaxed text-neutral-400">
            Log out of RepMind on this device. Your programs and progress stay
            saved to your account.
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-busy={isLoggingOut}
          className={cn(logoutButtonClass, isLoggingOut && 'text-red-300/80')}
        >
          {isLoggingOut ? <Spinner aria-hidden /> : <LogOut aria-hidden />}
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </button>
      </div>
      {logoutError && (
        <p
          role="alert"
          className="border-t border-neutral-800 px-4 py-3 text-sm text-red-400 sm:px-6"
        >
          Couldn&rsquo;t log out. Check your connection and try again.
        </p>
      )}
    </section>
  )
}
