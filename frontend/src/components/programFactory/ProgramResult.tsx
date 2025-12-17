import { useState } from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

export const ProgramResult = () => {
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const programData = useSelector(
    (state: RootState) => state.programGeneration.aiProgram
  )
  return (
    <div className="flex flex-col justify-center items-center">
      <Label className="text-[3rem] mb-10 font-thin">Your Program</Label>
      <div className="flex flex-row">
        {programData?.program_structure?.map((workout, index) => (
          <div key={index}>
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
      <div className="flex flex-col min-w-[500px] border rounded-md border-app-colors-300 p-5">
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
                  <AccordionContent>
                    {`Exercise tip: ${exercise.exercise_tip}`}
                  </AccordionContent>
                </AccordionItem>
              )
            )}
        </Accordion>
      </div>
    </div>
  )
}
