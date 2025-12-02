import { useState } from 'react'
import { useForm } from '@tanstack/react-form'

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent
} from '../ui/card'
import { Button } from '../ui/button'

const MAX_PAGE_NUM = 4

const fitnessGoalList = ['Gain muscle and lose fat', 'Lose fat', 'Gain muscle']

const yearsOfExperienceList = [
  'No Experience',
  '0 - 1 Years',
  '2 - 3 Years',
  '3 - 5 Years',
  'Over 5 Years'
]

const daysInWeekList = [
  '1 Day',
  '2 Days',
  '3 Days',
  '4 Days',
  '5 Days',
  '6-7 Days'
]
export const ProgramFactory = () => {
  const [pageNumber, setPageNumber] = useState<number>(0)

  const handlePageNumChange = (pageChange: number) => {
    if (pageChange < 0 && pageNumber > 0) {
      setPageNumber((prevPage) => prevPage - 1)
    } else if (pageChange > 0 && pageNumber < MAX_PAGE_NUM) {
      setPageNumber((prevPage) => prevPage + 1)
    }
  }

  const form = useForm({
    defaultValues: {
      fitnessGoal: '',
      yearsOfExperience: '',
      numDaysInWeek: '',
      age: '',
      weight: ''
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    }
  })

  return (
    <div className="flex flex-col justify-center items-center">
      <Card className="flex flex-col min-w-[450px] min-h-[550px] justify-between">
        <CardHeader>
          <CardTitle className="text-[2rem]">
            {pageNumber === 0 ? (
              <div>What are your fitness goals?</div>
            ) : pageNumber === 1 ? (
              <div>Years of experience working out?</div>
            ) : pageNumber === 2 ? (
              <div>How many days in a week can you workout?</div>
            ) : pageNumber === 3 ? (
              <div>What is your current Age and Weight?</div>
            ) : (
              <div>Summary</div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            {pageNumber === 0 ? (
              <form.Field name="fitnessGoal">
                {(field) => (
                  <div>
                    {fitnessGoalList.map((goal, index) => (
                      <div className="flex items-center gap-3" key={index}>
                        <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                          {goal}
                          <input
                            type="radio"
                            id={goal}
                            value={goal}
                            checked={field.state.value === goal}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </form.Field>
            ) : pageNumber === 1 ? (
              <form.Field name="yearsOfExperience">
                {(field) => (
                  <div>
                    {yearsOfExperienceList.map((years, index) => (
                      <div className="flex items-center gap-3" key={index}>
                        <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                          {years}
                          <input
                            type="radio"
                            id={years}
                            value={years}
                            checked={field.state.value === years}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </form.Field>
            ) : pageNumber === 2 ? (
              <form.Field name="numDaysInWeek">
                {(field) => (
                  <div>
                    {daysInWeekList.map((days, index) => (
                      <div className="flex items-center gap-3" key={index}>
                        <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                          {days}
                          <input
                            type="radio"
                            id={days}
                            value={days}
                            checked={field.state.value === days}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </form.Field>
            ) : pageNumber === 3 ? (
              <div>Age Weight and Gender input fields</div>
            ) : (
              <div>
                Summary
                <Button variant="default" type="submit">
                  Submit
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="pt">
          <div className="flex flex-row w-full justify-between">
            {pageNumber > 0 && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handlePageNumChange(-1)}
              >
                Back
              </Button>
            )}
            {pageNumber !== MAX_PAGE_NUM && (
              <Button
                variant="default"
                size="lg"
                onClick={() => handlePageNumChange(+1)}
              >
                Next
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
