import { Link } from '@tanstack/react-router'

import { CircleAlert } from 'lucide-react'

import { Card, CardHeader, CardFooter, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

export const LimitReachedDisplay = () => {
  const warningMessage =
    'You have reached the program generation limit for non logged-in users. Please login to continue using this feature!'

  return (
    <Card>
      <CardHeader className="!p-0 ">
        <div className="flex flex-col justify-center items-center bg-red-500 w-full h-full rounded-t-xl p-4">
          <CircleAlert className="!size-12 text-neutral-900 mb-2" />
          <label className="text-neutral-900 text-2xl font-semibold">
            Generation Limit Reached
          </label>
        </div>
      </CardHeader>
      <CardContent className="mt-6 max-w-[600px]">
        <label className="text-red-500 text-base font-medium">
          {warningMessage}
        </label>
      </CardContent>
      <Separator className="mt-auto mb-6" orientation="horizontal" />
      <CardFooter className="flex flex-row justify-center">
        <Link to="/login">
          <Button
            variant="secondary"
            size="lg"
            className="text-lg px-12 bg-red-500 text-neutral-900 hover:bg-red-700"
          >
            Login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
