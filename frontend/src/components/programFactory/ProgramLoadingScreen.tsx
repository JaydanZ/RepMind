import { Spinner } from '../ui/spinner'
import { Label } from '../ui/label'

export const ProgramLoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex flex-row gap-4">
        <Spinner className="size-9 text-app-colors-300" />
        <Label className="text-3xl text-app-colors-300">
          Creating program...
        </Label>
      </div>
      <Label className="text-sm text-neutral-400 font-normal">
        Generating your program on the backend. Please sit tight!
      </Label>
    </div>
  )
}
