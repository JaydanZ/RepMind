import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import { clearProgram } from '@/features/programGeneration/programGenerationSlice'
import { RootState } from '@/store/store'

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

export const ProgramResult = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const dispatch = useDispatch()
  const programData = useSelector(
    (state: RootState) => state.programGeneration.aiProgram
  )
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  return (
    <div className="flex flex-col justify-center items-center">
      <Button
        variant="ghost"
        className="text-app-colors-300 mr-auto"
        onClick={() => dispatch(clearProgram())}
      >
        <ArrowLeft />
        Back
      </Button>
      <Label className="text-[3rem] mb-10 font-thin">Your Program</Label>
      <div className="flex flex-row -mb-px">
        {programData?.program_structure?.map((workout, index) => (
          <div key={index} className={clsx(index === selectedDay && 'z-10')}>
            <Button
              variant="outline"
              className={clsx(
                'mx-1 border-b-0 rounded-b-none',
                index === selectedDay &&
                  'border-app-colors-300 text-app-colors-300 hover:text-app-colors-300 hover:bg-background'
              )}
              onClick={() => setSelectedDay(index)}
            >
              {workout.day.substring(0, 3)}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-[650px] border rounded-md border-app-colors-300 bg-background p-5">
        {programData?.program_structure && (
          <Label className="text-3xl mb-6">
            {programData.program_structure[selectedDay].focus}
          </Label>
        )}
        <Accordion type="single" collapsible defaultValue="exercise-0">
          {programData?.program_structure &&
            programData?.program_structure[selectedDay]?.exercises.map(
              (exercise, index) => (
                <AccordionItem key={index} value={`exercise-${index}`}>
                  <AccordionTrigger>{`${exercise.name} | ${exercise.sets}x${exercise.reps}`}</AccordionTrigger>
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
      <div className="flex flex-col max-w-[650px]">
        <Label className="text-[2rem] mb-6">Program Tips and Goals</Label>
        {programData?.program_tips_and_goals &&
          programData.program_tips_and_goals.map((tip, index) => (
            <div className="flex flex-row" key={index}>
              <span className="font-bold text-app-colors-300 text-[1.1rem] mr-2">{`${
                index + 1
              }.`}</span>
              <Label className="font-thin text-[1.1rem] mb-5">
                {` ${tip}`}
              </Label>
            </div>
          ))}
      </div>
      <Separator className="w-full my-8" />
      <div className="flex flex-col items-center pb-20">
        {isLoggedIn ? (
          <div className="flex flex-col items-center">
            <Button
              size="lg"
              variant="outline"
              className="border-app-colors-300 text-lg py-5 hover:bg-app-colors-300 hover:text-black"
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
              className="border-app-colors-300 text-lg py-5 hover:bg-app-colors-300 hover:text-black"
            >
              Generate new program
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-4">
            <Card className="w-max">
              <CardHeader className="pb-10">
                <CardTitle className="text-app-colors-300 text-2xl">
                  Want to generate a new program?
                </CardTitle>
                <CardDescription>
                  Login or register an account to continue using this feature!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-row gap-10 justify-between items-center">
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-app-colors-300 text-lg py-5 hover:bg-app-colors-300 hover:text-black"
                  >
                    Login
                  </Button>
                </Link>
                <Label className="italic text-neutral-500">Or</Label>
                <Link to="/registerUser">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-app-colors-300 text-lg py-5 hover:bg-app-colors-300 hover:text-black"
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
