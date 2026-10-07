// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { ManualProgramCreation } from './ManualProgramCreation'
import { programImport, updateProgram } from '@/services/programsAPI'
import { WorkoutProgram } from '@/types/programCreation'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn()
}))
vi.mock('react-redux', () => ({ useDispatch: () => vi.fn() }))
vi.mock('@/services/programsAPI', () => ({
  programImport: vi.fn(),
  updateProgram: vi.fn()
}))
vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }))
vi.mock('@/services/protectedRoutesAPI', () => ({
  protectedApiSlice: { util: { invalidateTags: vi.fn() } }
}))

describe('ManualProgramCreation', () => {
  afterEach(cleanup)

  it.each([0, 1])('removes day %i without crashing', (removeIndex) => {
    render(<ManualProgramCreation />)

    fireEvent.click(screen.getByRole('button', { name: 'Add day' }))
    const removeButtons = screen.getAllByRole('button', {
      name: /^Remove (Mon|Tues)day$/
    })
    expect(removeButtons).toHaveLength(2)

    fireEvent.click(removeButtons[removeIndex])

    expect(
      screen.queryAllByRole('button', { name: /^Remove \w+day$/ })
    ).toHaveLength(0)
    expect(screen.getAllByRole('group', { name: /day/ })).toHaveLength(1)
  })

  it('keeps the remaining day and exercise values after removing earlier ones', () => {
    render(<ManualProgramCreation />)

    fireEvent.click(screen.getByRole('button', { name: 'Add day' }))
    const focusInputs = screen.getAllByLabelText('Focus')
    fireEvent.change(focusInputs[0], { target: { value: 'Push' } })
    fireEvent.change(focusInputs[1], { target: { value: 'Pull' } })

    // Two exercises on the remaining day, then remove the first
    fireEvent.click(screen.getAllByRole('button', { name: 'Add exercise' })[1])
    const exerciseInputs = screen.getAllByLabelText('Exercise Name')
    fireEvent.change(exerciseInputs[1], { target: { value: 'Row' } })
    fireEvent.change(exerciseInputs[2], { target: { value: 'Curl' } })

    fireEvent.click(screen.getByRole('button', { name: 'Remove Monday' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove exercise 1 from Tuesday' })
    )

    expect(screen.getByLabelText('Focus')).toHaveProperty('value', 'Pull')
    expect(screen.getByLabelText('Exercise Name')).toHaveProperty('value', 'Curl')
  })

  it('moves a day to its place in the week and keeps its values', () => {
    render(<ManualProgramCreation />)

    fireEvent.click(screen.getByRole('button', { name: 'Add day' }))
    const focusInputs = screen.getAllByLabelText('Focus')
    fireEvent.change(focusInputs[0], { target: { value: 'Push' } })
    fireEvent.change(focusInputs[1], { target: { value: 'Pull' } })

    // Monday becomes Friday, so it should now render after Tuesday
    fireEvent.keyDown(
      screen.getByRole('button', { name: /^Training day: Monday/ }),
      {
        key: 'Enter'
      }
    )
    fireEvent.click(screen.getByRole('menuitemradio', { name: 'Friday' }))

    expect(
      screen
        .getAllByRole('group', { name: /day/ })
        .map((group) => group.getAttribute('aria-label'))
    ).toEqual(['Tuesday', 'Friday'])
    expect(
      screen
        .getAllByLabelText('Focus')
        .map((input) => (input as HTMLInputElement).value)
    ).toEqual(['Pull', 'Push'])
  })

  describe('editing a saved program', () => {
    const savedProgram: WorkoutProgram = {
      id: 'program-1',
      program_name: 'Upper / Lower',
      description: null,
      created_at: '',
      updated_at: '',
      user_id: 'user-1',
      program_structure: [
        {
          day: 'Thursday',
          focus: 'Lower',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5, exercise_tip: 'Brace hard' }
          ]
        },
        {
          day: 'Monday',
          focus: 'Upper',
          exercises: [{ name: 'Bench Press', sets: 3, reps: 8 }]
        }
      ]
    }

    it('fills the form with the saved program', () => {
      render(<ManualProgramCreation program={savedProgram} />)

      expect(
        screen.getByRole('heading', { name: 'Edit program' })
      ).toBeTruthy()
      expect(screen.getByLabelText('Program name')).toHaveProperty(
        'value',
        'Upper / Lower'
      )
      expect(
        screen
          .getAllByRole('group', { name: /day/ })
          .map((group) => group.getAttribute('aria-label'))
      ).toEqual(['Monday', 'Thursday'])
      expect(
        screen
          .getAllByLabelText('Exercise Name')
          .map((input) => (input as HTMLInputElement).value)
      ).toEqual(['Bench Press', 'Squat'])
    })

    it('collapses a day before anything is edited', () => {
      render(<ManualProgramCreation program={savedProgram} />)

      fireEvent.click(screen.getByRole('button', { name: 'Collapse Monday' }))

      expect(
        screen
          .getByRole('button', { name: 'Expand Monday' })
          .getAttribute('aria-expanded')
      ).toBe('false')
    })

    it('updates the saved program and keeps exercise tips', async () => {
      render(<ManualProgramCreation program={savedProgram} />)

      fireEvent.change(screen.getByLabelText('Program name'), {
        target: { value: 'Upper / Lower v2' }
      })
      fireEvent.click(screen.getByRole('button', { name: /Save changes/ }))

      await waitFor(() => expect(updateProgram).toHaveBeenCalledTimes(1))
      expect(programImport).not.toHaveBeenCalled()
      expect(updateProgram).toHaveBeenCalledWith('program-1', {
        program_name: 'Upper / Lower v2',
        program_structure: [
          {
            day: 'Monday',
            focus: 'Upper',
            exercises: [
              { name: 'Bench Press', sets: 3, reps: 8, exercise_tip: '' }
            ]
          },
          {
            day: 'Thursday',
            focus: 'Lower',
            exercises: [
              { name: 'Squat', sets: 5, reps: 5, exercise_tip: 'Brace hard' }
            ]
          }
        ]
      })
    })
  })
})
