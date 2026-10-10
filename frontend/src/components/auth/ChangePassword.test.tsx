// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { ChangePassword } from './ChangePassword'
import { userLogin } from '@/features/auth/authSlice'
import { toast } from '@/hooks/use-toast'

const navigate = vi.fn()
const dispatch = vi.fn()
const changePassword = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => navigate
}))
vi.mock('@/store/store', () => ({ useAsyncDispatch: () => dispatch }))
vi.mock('@/features/auth/authSlice', () => ({
  userLogin: vi.fn((data) => ({ type: 'auth/storeToken', payload: data }))
}))
vi.mock('@/services/protectedRoutesAPI', () => ({
  useChangePasswordMutation: () => [changePassword, { isLoading: false }]
}))
vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }))

const SESSION = {
  token_data: { access_token: 'new-access', token_type: 'bearer' },
  refresh_token_data: 'new-refresh',
  username: 'lifter',
  email: 'lifter@example.com'
}

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

const fillForm = (
  oldPassword: string,
  newPassword: string,
  confirm: string
) => {
  type('Current password', oldPassword)
  type('New password', newPassword)
  type('Confirm new password', confirm)
  fireEvent.click(screen.getByRole('button', { name: 'Change password' }))
}

describe('ChangePassword', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('stores the fresh session, then returns to the profile', async () => {
    changePassword.mockReturnValue({ unwrap: () => Promise.resolve(SESSION) })
    render(<ChangePassword />)

    fillForm('old-password', 'new-password', 'new-password')

    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: '/profile' })
    )
    expect(changePassword).toHaveBeenCalledWith({
      old_password: 'old-password',
      new_password: 'new-password',
      confirm_password: 'new-password'
    })
    expect(userLogin).toHaveBeenCalledWith({
      email: SESSION.email,
      username: SESSION.username,
      refresh_token: 'new-refresh',
      token_data: SESSION.token_data
    })
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success', title: 'Password changed' })
    )
  })

  it('shows the server error for a wrong current password', async () => {
    changePassword.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          status: 400,
          data: { detail: 'Current password is incorrect' }
        })
    })
    render(<ChangePassword />)

    fillForm('wrong-password', 'new-password', 'new-password')

    expect(
      await screen.findByText('Error: Current password is incorrect')
    ).toBeTruthy()
    expect(dispatch).not.toHaveBeenCalled()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('explains rate limiting instead of showing a raw error', async () => {
    changePassword.mockReturnValue({
      unwrap: () => Promise.reject({ status: 429, data: { error: 'limit' } })
    })
    render(<ChangePassword />)

    fillForm('wrong-password', 'new-password', 'new-password')

    expect(
      await screen.findByText(
        'Error: Too many attempts. Wait a minute and try again.'
      )
    ).toBeTruthy()
  })

  it.each([
    ['too short', 'short', 'short', 'Password must be at least 8 characters'],
    ['mismatched', 'new-password', 'other-password', 'Passwords do not match']
  ])(
    'does not submit a %s new password',
    async (_, newPassword, confirm, message) => {
      render(<ChangePassword />)

      fillForm('old-password', newPassword, confirm)

      expect(await screen.findByText(message)).toBeTruthy()
      expect(changePassword).not.toHaveBeenCalled()
    }
  )
})
