import { useState, Activity } from 'react'
import { useForm, useStore } from '@tanstack/react-form'
import clsx from 'clsx'

import { ChevronDownIcon } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
  CardDescription
} from '../ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../ui/input-group'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

enum WeightUnits {
  Pounds = 'Lbs',
  Kilograms = 'KGs'
}

const MAX_SECTION_NUM = 4
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
const genderOptions = ['Male', 'Female']
const summaryFieldNames = [
  'Fitness goal',
  'Years of experience',
  'Days per week',
  'Age',
  'Weight',
  'Gender'
]

export const ProgramFactory = () => {
  const [sectionNumber, setSectionNumber] = useState<number>(0)
  const [weightUnit, setWeightUnit] = useState<WeightUnits>(WeightUnits.Pounds)
  const [sectionError, setSectionError] = useState<string>('')

  const form = useForm({
    defaultValues: {
      fitnessGoal: '',
      yearsOfExperience: '',
      numDaysInWeek: '',
      age: '',
      weight: '',
      gender: ''
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    }
  })

  const formValues = useStore(form.store, (state) => state.values)
  const formValuesArray = Array.from(
    Object.entries(formValues),
    ([option, value]) => ({ option, value })
  )

  const handleSectionNumChange = (sectionChange: number) => {
    // Before advancing to the next section, we need to manually check if all necessary fields have been filled out in a section
    // Only when user clicks next, ignore if back is clicked

    setSectionError('')

    if (sectionChange > 0) {
      switch (sectionNumber) {
        case 0:
          if (form.getFieldValue('fitnessGoal').length === 0) {
            setSectionError('Error: you must select an option')
            return
          }
          break
        case 1:
          if (form.getFieldValue('yearsOfExperience').length === 0) {
            setSectionError('Error: you must select an option')
            return
          }
          break
        case 2:
          if (form.getFieldValue('numDaysInWeek').length === 0) {
            setSectionError('Error: you must select an option')
            return
          }
          break
        case 3:
          if (
            form.getFieldValue('age').length === 0 ||
            form.getFieldValue('weight').length === 0 ||
            form.getFieldValue('gender').length === 0
          ) {
            setSectionError('Error: all fields must be filled in / selected')
            return
          }
          break
      }
    }

    if (sectionChange < 0 && sectionNumber > 0) {
      setSectionNumber((prevSection) => prevSection - 1)
    } else if (sectionChange > 0 && sectionNumber < MAX_SECTION_NUM) {
      setSectionNumber((prevSection) => prevSection + 1)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <Card
        className={clsx(
          'flex flex-col min-w-[450px] min-h-[550px] justify-between',
          sectionError.length > 0 && 'border-red-500'
        )}
      >
        <CardHeader>
          <CardTitle className="text-[2rem]">
            {sectionNumber === 0 ? (
              <div>Fitness Goals</div>
            ) : sectionNumber === 1 ? (
              <div>Years of Experience</div>
            ) : sectionNumber === 2 ? (
              <div>Workout Frequency</div>
            ) : sectionNumber === 3 ? (
              <div>Age, Weight and Gender</div>
            ) : (
              <div>Summary</div>
            )}
          </CardTitle>
          <CardDescription>
            {sectionNumber === 0 ? (
              <div>
                What fitness goals are you trying to achieve with the program?
              </div>
            ) : sectionNumber === 1 ? (
              <div>How many years of experience do you have working out?</div>
            ) : sectionNumber === 2 ? (
              <div>How many days in a week can you workout?</div>
            ) : sectionNumber === 3 ? (
              <div>What is your current age, weight and gender?</div>
            ) : (
              <div>Here are all of the options you selected:</div>
            )}
          </CardDescription>
          {sectionError.length > 0 && (
            <Label className="pt-4 pb-1 text-red-500">{sectionError}</Label>
          )}
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <Activity mode={sectionNumber === 0 ? 'visible' : 'hidden'}>
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
            </Activity>
            <Activity mode={sectionNumber === 1 ? 'visible' : 'hidden'}>
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
            </Activity>
            <Activity mode={sectionNumber === 2 ? 'visible' : 'hidden'}>
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
            </Activity>
            <Activity mode={sectionNumber === 3 ? 'visible' : 'hidden'}>
              <div className="flex flex-col gap-6">
                <form.Field name="age">
                  {(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor={field.name} className="text-lg">
                        Age
                      </Label>
                      <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="25"
                        id={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={clsx(
                          sectionError.length > 0 &&
                            field.state.value.length === 0 &&
                            'border-red-500 focus-visible:ring-0'
                        )}
                      />
                    </div>
                  )}
                </form.Field>
                <form.Field name="weight">
                  {(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor={field.name} className="text-lg">
                        Weight
                      </Label>
                      <InputGroup
                        className={clsx(
                          sectionError.length > 0 &&
                            field.state.value.length === 0 &&
                            'border-red-500 has-[[data-slot=input-group-control]:focus-visible]:ring-0'
                        )}
                      >
                        <InputGroupInput
                          placeholder="180"
                          type="number"
                          inputMode="numeric"
                          id={field.name}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <InputGroupAddon align="inline-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <InputGroupButton
                                variant="ghost"
                                className="!pr-1.5 text-s"
                              >
                                {weightUnit}{' '}
                                <ChevronDownIcon className="size-1" />
                              </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setWeightUnit(WeightUnits.Pounds)
                                }
                              >
                                {WeightUnits.Pounds}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setWeightUnit(WeightUnits.Kilograms)
                                }
                              >
                                {WeightUnits.Kilograms}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                  )}
                </form.Field>
                <form.Field name="gender">
                  {(field) => (
                    <div>
                      <Label htmlFor="gender" className="text-lg">
                        Gender
                      </Label>
                      <div
                        className="flex flex-row w-full justify-between space-x-4"
                        id="gender"
                      >
                        {genderOptions.map((gender, index) => (
                          <div
                            className="flex items-center m w-full"
                            key={index}
                          >
                            <label className="flex flex-row hover:cursor-pointer justify-between items-center w-full p-5 my-2 bg-neutral-900 border-2 rounded-lg font-medium has-[:checked]:border-app-colors-300 has-[:checked]:text-app-colors-300 has-[:checked]:bg-app-colors-300/5 hover:bg-neutral-800">
                              {gender}
                              <input
                                type="radio"
                                id={gender}
                                value={gender}
                                checked={field.state.value === gender}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                className="w-4 h-4 appearance-none rounded-full border-2 border-solid border-neutral-600 bg-neutral-600 checked:border-app-colors-300 checked:bg-app-colors-300"
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form.Field>
              </div>
            </Activity>
            <Activity
              mode={sectionNumber === MAX_SECTION_NUM ? 'visible' : 'hidden'}
            >
              <div className="flex flex-col items-center w-full h-full">
                <div className="flex flex-col w-full">
                  {formValuesArray.map((formField, index) => (
                    <div
                      className="flex flex-row my-1 justify-between"
                      key={index}
                    >
                      <Label className="text-[1rem] text-neutral-400">
                        {summaryFieldNames[index]}
                      </Label>
                      <Label className="text-[0.9rem]">{formField.value}</Label>
                    </div>
                  ))}
                </div>
                <Button
                  variant="default"
                  type="submit"
                  size="lg"
                  className="mt-6 w-full"
                >
                  Generate Program
                </Button>
              </div>
            </Activity>
          </form>
        </CardContent>
        <Separator className="mt-auto mb-6" orientation="horizontal" />
        <CardFooter className="flex flex-col">
          <div className="flex flex-row w-full justify-between">
            {sectionNumber > 0 && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleSectionNumChange(-1)}
                className="mr-auto"
              >
                Back
              </Button>
            )}
            {sectionNumber !== MAX_SECTION_NUM && (
              <Button
                variant="default"
                size="lg"
                onClick={() => handleSectionNumChange(+1)}
                className="ml-auto"
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
