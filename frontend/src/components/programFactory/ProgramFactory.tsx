import { useState } from 'react'
import { useForm } from '@tanstack/react-form'

import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent
} from '../ui/card'
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

const MAX_PAGE_NUM = 4

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
              //<div>List of fitness goals</div>
              <form.Field name="fitnessGoal">
                {(field) => (
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        Gain muscle and lose fat
                        <input
                          type="radio"
                          id="gain-muscle-lose-fat"
                          value="gain muscle and lose fat"
                          checked={
                            field.state.value === 'gain muscle and lose fat'
                          }
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        Lose fat
                        <input
                          type="radio"
                          id="lose-fat"
                          value="lose fat"
                          checked={field.state.value === 'lose fat'}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        Gain muscle
                        <input
                          type="radio"
                          id="gain-muscle"
                          value="gain muscle"
                          checked={field.state.value === 'gain muscle'}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </form.Field>
            ) : pageNumber === 1 ? (
              <form.Field name="yearsOfExperience">
                {(field) => (
                  <div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        No experience
                        <input
                          type="radio"
                          id="No experience"
                          value="No experience"
                          checked={field.state.value === 'No experience'}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        0 - 1 Years
                        <input
                          type="radio"
                          id="0 - 1 Years"
                          value="0 - 1 Years"
                          checked={field.state.value === '0 - 1 Years'}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        2 - 3 Years
                        <input
                          type="radio"
                          id="2 - 3 Years"
                          value="2 - 3 Years"
                          checked={field.state.value === '2 - 3 Years'}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        3 - 5 Years
                        <input
                          type="radio"
                          id="3 - 5 Years"
                          value="3 - 5 Years"
                          checked={field.state.value === '3 - 5 Years'}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                        Over 5 Years
                        <input
                          type="radio"
                          id="Over 5 Years"
                          value="Over 5 Years"
                          checked={field.state.value === 'Over 5 Years'}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </form.Field>
            ) : pageNumber === 2 ? (
              <div>days in a week options</div>
            ) : pageNumber === 3 ? (
              <div>Age Weight and Gender input fields</div>
            ) : (
              <div>Summary</div>
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
