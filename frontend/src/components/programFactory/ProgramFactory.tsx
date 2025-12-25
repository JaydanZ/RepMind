import { useState, Activity } from 'react'
import { useForm, useStore } from '@tanstack/react-form'
import clsx from 'clsx'

import { useAsyncDispatch } from '@/store/store'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { getAIProgram } from '@/features/programGeneration/programGenerationSlice'
import { ProgramOptions } from '@/types/programCreation'

import { ChevronDownIcon, Cog } from 'lucide-react'
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
const MAX_AGE = 120
const MAX_WEIGHT = 900
const sections = [
  {
    sectionName: 'Fitness Goal',
    sectionNum: 0
  },
  {
    sectionName: 'Years of Experience',
    sectionNum: 1
  },
  {
    sectionName: 'Workout Frequency',
    sectionNum: 2
  },
  {
    sectionName: 'Age, Weight and Gender',
    sectionNum: 3
  },
  {
    sectionName: 'Summary',
    sectionNum: 4
  }
]
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

export const ProgramFactory = () => {
  const [sectionNumber, setSectionNumber] = useState<number>(0)
  const [weightUnit, setWeightUnit] = useState<WeightUnits>(WeightUnits.Pounds)
  const [sectionError, setSectionError] = useState<string>('')

  const isUserLoggedIn = useSelector(
    (state: RootState) => state.auth.isLoggedIn
  )
  const dispatch = useAsyncDispatch()

  const summaryFieldNames = [
    {
      section: 'Fitness goal',
      sectionNum: 0
    },
    {
      section: 'Years of experience',
      sectionNum: 1
    },
    {
      section: 'Days per week',
      sectionNum: 2
    },
    {
      section: 'Age',
      sectionNum: 3
    },
    {
      section: `Weight (${weightUnit})`,
      sectionNum: 3
    },
    {
      section: 'Gender',
      sectionNum: 3
    }
  ]

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
      const formattedAge = parseInt(value.age)
      const formattedWeight = parseInt(value.weight)

      const programInput: ProgramOptions = {
        fitness_goal: value.fitnessGoal,
        years_of_experience: value.yearsOfExperience,
        days_per_week: value.numDaysInWeek,
        age: formattedAge,
        weight: formattedWeight,
        weight_unit: weightUnit,
        gender: value.gender,
        isLoggedIn: isUserLoggedIn
      }

      try {
        await dispatch(getAIProgram(programInput))
      } catch (error) {
        console.error(error)
      }
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
      <Label className="text-[3rem] mb-8 font-thin">Program Generator</Label>
      <div className="flex flex-row w-full mb-6 gap-x-4">
        {sections.map((section, index) => (
          <div className="flex flex-col items-center" key={index}>
            <Label
              className={clsx(
                'text-[0.8rem] mb-2',
                sectionNumber >= section.sectionNum
                  ? 'text-app-colors-300'
                  : 'text-neutral-500'
              )}
            >
              {section.sectionName}
            </Label>
            <div
              className={clsx(
                'inline-block w-[140px] min-h-[4px] rounded-xl',
                sectionNumber >= section.sectionNum
                  ? 'bg-app-colors-300'
                  : 'bg-neutral-500'
              )}
            ></div>
          </div>
        ))}
      </div>
      <Card
        className={clsx(
          'flex flex-col w-full min-h-[550px] justify-between',
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
                <form.Field
                  name="age"
                  validators={{
                    onChange: ({ value }) => {
                      const formattedAge = parseInt(value)
                      if (formattedAge < 0)
                        return 'Age cannot be a negative number'
                      if (formattedAge > MAX_AGE)
                        return `Age cannot be greater than ${MAX_AGE}`
                      return undefined
                    }
                  }}
                >
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
                          (sectionError.length > 0 &&
                            field.state.value.length === 0) ||
                            (field.state.meta.errors.length > 0 &&
                              'border-red-500 focus-visible:ring-0')
                        )}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                <form.Field
                  name="weight"
                  validators={{
                    onChange: ({ value }) => {
                      const formattedWeight = parseInt(value)
                      if (formattedWeight < 0)
                        return 'Weight cannot be a negative number'
                      if (formattedWeight > MAX_WEIGHT)
                        return `Weight cannot be greater than ${MAX_WEIGHT} ${weightUnit}`
                      return undefined
                    }
                  }}
                >
                  {(field) => (
                    <div className="grid gap-3">
                      <Label htmlFor={field.name} className="text-lg">
                        Weight
                      </Label>
                      <InputGroup
                        className={clsx(
                          (sectionError.length > 0 &&
                            field.state.value.length === 0) ||
                            (field.state.meta.errors.length > 0 &&
                              'border-red-500 has-[[data-slot=input-group-control]:focus-visible]:ring-0')
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
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm">
                          {field.state.meta.errors.join(', ')}
                        </p>
                      )}
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
                      <Label className="text-[1.1rem] text-neutral-400">
                        {summaryFieldNames[index].section}
                      </Label>
                      <div className="flex flex-row justify-center items-center">
                        <Label className="text-[1.1rem]">
                          {formField.value}
                        </Label>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            setSectionNumber(
                              summaryFieldNames[index].sectionNum
                            )
                          }
                          className="p-0 pl-2 w-fit h-fit text-neutral-400 text-xs"
                        >
                          <Cog className="!size-4" />
                        </Button>
                      </div>
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
