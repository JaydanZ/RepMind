import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/registerUser')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full max-w-[1920px] h-dvh justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-[2.5rem]">Signup</CardTitle>
          <CardDescription className="pb-5">
            Create an account to unlock the full features of RepMind
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="user" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="grid gap-2 py-5">
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" required />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button type="submit" className="w-full">
            Signup
          </Button>
          <Label className="text-white/60 text-sm py-5">
            Already have an account?
          </Label>
          <Link to="/login" className="w-full">
            <Button variant="secondary" className="w-full">
              Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
