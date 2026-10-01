import { Link } from '@tanstack/react-router'

import { CircleAlert } from 'lucide-react'

import { Card, CardHeader, CardFooter, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ReactElement } from 'react'

interface LimitReachedProp {
  authLimitReached: boolean
}

export const LimitReachedDisplay = (props: LimitReachedProp): ReactElement => {
  const warningMessage = props.authLimitReached
    ? 'You have reached the program generation limit. Please wait a moment before generating another program!'
    : 'You have reached the program generation limit for non logged-in users. Please login to continue using this feature!'

  return (
    <Card className="w-full sm:w-auto">
      <CardHeader className="!p-0 ">
        <div className="flex flex-col justify-center items-center bg-red-500 w-full h-full rounded-t-xl p-4">
          <CircleAlert className="!size-10 sm:!size-12 text-neutral-900 mb-2" />
          <label className="text-neutral-900 text-xl sm:text-2xl font-semibold text-center">
            Generation Limit Reached
          </label>
        </div>
      </CardHeader>
      <CardContent className="mt-6 max-w-[600px] p-4 pt-0 sm:p-6 sm:pt-0">
        <label className="text-red-500 text-base font-medium">
          {warningMessage}
        </label>
      </CardContent>

      <Separator className="mt-auto mb-4 sm:mb-6" orientation="horizontal" />
      {!props.authLimitReached && (
        <CardFooter className="flex flex-row justify-center p-4 pt-0 sm:p-6 sm:pt-0">
          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full h-11 sm:w-auto sm:h-10 text-lg px-12 bg-red-500 text-neutral-900 [-webkit-tap-highlight-color:transparent] transition-[transform,background-color] duration-150 ease-out-strong active:scale-[0.97] motion-reduce:active:scale-100 [@media(hover:hover)]:hover:bg-red-700"
            >
              Login
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  )
}
