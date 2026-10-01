import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { clearProgram } from '@/features/programGeneration/programGenerationSlice'
import { RootState } from '@/store/store'
import { ProgramStruct } from '@/types/programCreation'
import { programImport } from '@/services/programsAPI'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '../ui/card'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'

const ctaClass =
  'border-app-colors-300 text-lg py-5 h-12 sm:h-10 [-webkit-tap-highlight-color:transparent] transition-[transform,background-color,color] duration-150 ease-out-strong active:scale-[0.97] motion-reduce:active:scale-100 [@media(hover:hover)]:hover:bg-app-colors-300 [@media(hover:hover)]:hover:text-black'

export const ProgramResult = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const dispatch = useDispatch()
  const programData = useSelector(
    (state: RootState) => state.programGeneration.aiProgram
  )
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  const handleProgramImport = async () => {
    if (programData) {
      const program: ProgramStruct = {
        program_name: programData?.name,
        program_structure: programData?.program_structure
      }

      try {
        const response = await programImport(program)
        console.log(response)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full min-[800px]:w-auto">
      <Button
        variant="ghost"
        className="text-app-colors-300 mr-auto -ml-2 h-11 px-2 min-[800px]:ml-0 min-[800px]:h-9 min-[800px]:px-4"
        onClick={() => dispatch(clearProgram())}
      >
        <ArrowLeft />
        Back
      </Button>
      <Label className="text-[2.25rem] leading-tight text-center text-balance mt-2 mb-8 min-[800px]:mt-0 min-[800px]:text-[3rem] min-[800px]:mb-10 font-thin">
        {programData?.name ? programData.name : 'Your Program'}
      </Label>
      <div className="flex flex-row w-full gap-1 -mb-px min-[800px]:w-auto min-[800px]:gap-0">
        {programData?.program_structure?.map((workout, index) => (
          <div
            key={index}
            className={clsx(
              'flex-1 min-w-0 min-[800px]:flex-none',
              index === selectedDay && 'z-10'
            )}
          >
            <Button
              variant="outline"
              className={clsx(
                'w-full h-11 px-0 border-b-0 rounded-b-none [-webkit-tap-highlight-color:transparent] min-[800px]:w-auto min-[800px]:h-9 min-[800px]:px-4 min-[800px]:mx-1',
                index === selectedDay &&
                  'border-app-colors-300 text-app-colors-300 hover:text-app-colors-300 hover:bg-background'
              )}
              aria-pressed={index === selectedDay}
              onClick={() => setSelectedDay(index)}
            >
              {workout.day.substring(0, 3)}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full min-[800px]:w-[650px] border rounded-md rounded-t-none min-[800px]:rounded-t-md border-app-colors-300 bg-background p-4 sm:p-5">
        {programData?.program_structure && (
          <Label className="text-2xl leading-tight mb-4 sm:text-3xl sm:mb-6">
            {programData.program_structure[selectedDay].focus}
          </Label>
        )}
        <Accordion type="single" collapsible defaultValue="exercise-0">
          {programData?.program_structure &&
            programData?.program_structure[selectedDay]?.exercises.map(
              (exercise, index) => (
                <AccordionItem key={index} value={`exercise-${index}`}>
                  <AccordionTrigger className="gap-3 [-webkit-tap-highlight-color:transparent] [@media(hover:none)]:hover:no-underline">{`${exercise.name} | ${exercise.sets}x${exercise.reps}`}</AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4">
                    <Label>{`Sets: ${exercise.sets}`}</Label>
                    <Label>{`Reps: ${exercise.reps}`}</Label>
                    {`Exercise tip: ${exercise.exercise_tip}`}
                  </AccordionContent>
                </AccordionItem>
              )
            )}
        </Accordion>
      </div>
      <Separator className="w-full mt-10 mb-6" />
      <div className="flex flex-col w-full max-w-[650px]">
        <Label className="text-2xl leading-tight mb-6 sm:text-[2rem]">
          Program Tips and Goals
        </Label>
        {programData?.program_tips_and_goals &&
          programData.program_tips_and_goals.map((tip, index) => (
            <div className="flex flex-row" key={index}>
              <span className="font-bold text-app-colors-300 text-base leading-relaxed tabular-nums sm:text-[1.1rem] mr-2">{`${
                index + 1
              }.`}</span>
              <Label className="font-thin text-base leading-relaxed sm:text-[1.1rem] mb-5">
                {` ${tip}`}
              </Label>
            </div>
          ))}
      </div>
      <Separator className="w-full my-8" />
      <div className="flex flex-col items-center w-full pb-20">
        {isLoggedIn ? (
          <div className="flex flex-col items-center w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className={clsx(ctaClass, 'w-full sm:w-auto')}
              onClick={handleProgramImport}
            >
              Import program into profile
            </Button>
            <label className="italic text-xl text-neutral-400 font-thin py-4">
              Or
            </label>
            <Button
              size="lg"
              variant="outline"
              onClick={() => dispatch(clearProgram())}
              className={clsx(ctaClass, 'w-full sm:w-auto')}
            >
              Generate new program
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full pt-4 sm:w-auto">
            <Card className="w-full sm:w-max">
              <CardHeader className="p-4 pb-8 sm:p-6 sm:pb-10">
                <CardTitle className="text-app-colors-300 text-xl leading-tight sm:text-2xl">
                  Want to generate a new program?
                </CardTitle>
                <CardDescription>
                  Login or register an account to continue using this feature!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 p-4 pt-0 sm:flex-row sm:gap-10 sm:p-6 sm:pt-0 justify-between items-center">
                <Link to="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className={clsx(ctaClass, 'w-full')}
                  >
                    Login
                  </Button>
                </Link>
                <Label className="italic text-neutral-500">Or</Label>
                <Link to="/registerUser" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className={clsx(ctaClass, 'w-full')}
                  >
                    Register
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
