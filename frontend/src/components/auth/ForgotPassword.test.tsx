// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { AxiosError, AxiosHeaders } from 'axios'
import { ForgotPassword } from './ForgotPassword'
import {
  confirmPasswordReset,
  requestPasswordReset,
  verifyResetCode
} from '@/services/authAPI'
import { toast } from '@/hooks/use-toast'

const navigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => navigate
}))
vi.mock('@/services/authAPI', () => ({
  requestPasswordReset: vi.fn(),
  verifyResetCode: vi.fn(),
  confirmPasswordReset: vi.fn()
}))
vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }))

const httpError = (status: number, detail: string) =>
  new AxiosError('Request failed', String(status), undefined, undefined, {
    status,
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: { detail }
  })

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } })

const click = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }))

const reachCodeStep = async () => {
  vi.mocked(requestPasswordReset).mockResolvedValue({ message: 'sent' })
  render(<ForgotPassword />)
  type('Email', ' lifter@example.com ')
  click('Send code')
  await screen.findByLabelText('Verification code')
}

const reachPasswordStep = async () => {
  await reachCodeStep()
  vi.mocked(verifyResetCode).mockResolvedValue({ reset_token: 'token-1' })
  type('Verification code', '123456')
  click('Verify code')
  await screen.findByLabelText('New password')
}

describe('ForgotPassword', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('sends a code to the trimmed email and shows the generic message', async () => {
    await reachCodeStep()

    expect(requestPasswordReset).toHaveBeenCalledWith('lifter@example.com')
    expect(
      screen.getByText(/If an account exists for lifter@example.com/)
    ).toBeTruthy()
  })

  it('keeps only digits in the code field', async () => {
    await reachCodeStep()

    type('Verification code', '12a-34')

    expect(screen.getByLabelText('Verification code')).toHaveProperty(
      'value',
      '1234'
    )
  })

  it('shows the server error for a wrong code and stays on the code step', async () => {
    await reachCodeStep()
    vi.mocked(verifyResetCode).mockRejectedValue(
      httpError(400, 'Invalid or expired code')
    )

    type('Verification code', '000000')
    click('Verify code')

    expect(
      await screen.findByText('Error: Invalid or expired code')
    ).toBeTruthy()
    expect(screen.getByLabelText('Verification code')).toBeTruthy()
  })

  it('does not submit mismatched passwords', async () => {
    await reachPasswordStep()

    type('New password', 'new-password')
    type('Confirm new password', 'other-password')
    click('Reset password')

    expect(await screen.findByText('Passwords do not match')).toBeTruthy()
    expect(confirmPasswordReset).not.toHaveBeenCalled()
  })

  it('resets the password with the token, then sends the user to login', async () => {
    await reachPasswordStep()
    vi.mocked(confirmPasswordReset).mockResolvedValue({})

    type('New password', 'new-password')
    type('Confirm new password', 'new-password')
    click('Reset password')

    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: '/login' }))
    expect(confirmPasswordReset).toHaveBeenCalledWith(
      'token-1',
      'new-password',
      'new-password'
    )
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success', title: 'Password reset' })
    )
  })

  it('starts over when the reset token was rejected', async () => {
    await reachPasswordStep()
    vi.mocked(confirmPasswordReset).mockRejectedValue(
      httpError(400, 'Reset session expired, request a new code')
    )

    type('New password', 'new-password')
    type('Confirm new password', 'new-password')
    click('Reset password')

    expect(
      await screen.findByText(
        'Error: Reset session expired, request a new code'
      )
    ).toBeTruthy()
    expect(screen.getByLabelText('Email')).toBeTruthy()
    expect(navigate).not.toHaveBeenCalled()
  })
})
