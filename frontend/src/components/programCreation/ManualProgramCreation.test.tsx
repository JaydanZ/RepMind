// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ManualProgramCreation } from './ManualProgramCreation'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn()
}))
vi.mock('react-redux', () => ({ useDispatch: () => vi.fn() }))
vi.mock('@/services/programsAPI', () => ({ programImport: vi.fn() }))
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
    const exerciseInputs = screen.getAllByLabelText('Exercise')
    fireEvent.change(exerciseInputs[1], { target: { value: 'Row' } })
    fireEvent.change(exerciseInputs[2], { target: { value: 'Curl' } })

    fireEvent.click(screen.getByRole('button', { name: 'Remove Monday' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove exercise 1 from Tuesday' })
    )

    expect(screen.getByLabelText('Focus')).toHaveProperty('value', 'Pull')
    expect(screen.getByLabelText('Exercise')).toHaveProperty('value', 'Curl')
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
})
