// Mirrors backend/models/auth.py
export const MIN_PASSWORD_LENGTH = 8
// bcrypt only accepts up to 72 bytes
export const MAX_PASSWORD_BYTES = 72
export const RESET_CODE_LENGTH = 6

export const newPasswordError = (value: string) => {
  if (value.length === 0) return 'Password is required'
  if (value.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  if (new TextEncoder().encode(value).length > MAX_PASSWORD_BYTES)
    return 'Password is too long'
  return undefined
}

export const confirmPasswordError = (value: string, newPassword: string) => {
  if (value.length === 0) return 'Confirm your new password'
  if (value !== newPassword) return 'Passwords do not match'
  return undefined
}
