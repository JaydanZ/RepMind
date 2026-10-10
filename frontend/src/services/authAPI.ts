import axios from 'axios'
import { SignupUser } from '@/types/auth'
import { UserCredentials } from '../types/auth'
import { API_BASE_URL } from './apiConfig'

export const signupUser = async (userCredentials: SignupUser) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/register`,
    userCredentials
  )
  return response
}

export const loginUser = async (userCredentials: UserCredentials) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/login`,
    userCredentials
  )
  return response
}

export const logoutUser = async () => {
  const refreshTokenInStore = await cookieStore.get('refresh_token')
  const refresh_token = refreshTokenInStore ? refreshTokenInStore.value : null

  const response = await axios.post(`${API_BASE_URL}/auth/logout`, {
    refresh_token: refresh_token
  })
  return response.data
}

export const genNewAccessToken = async () => {
  const refreshTokenInStore = await cookieStore.get('refresh_token')
  const refresh_token = refreshTokenInStore ? refreshTokenInStore.value : null

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refresh_token
    })
    return response.data
  } catch (axiosError) {
    console.error(axiosError)
    return
  }
}

export const requestPasswordReset = async (email: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/password-reset/request`,
    { email }
  )
  return response.data as { message: string }
}

export const verifyResetCode = async (email: string, code: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/password-reset/verify`,
    { email, code }
  )
  return response.data as { reset_token: string }
}

export const confirmPasswordReset = async (
  resetToken: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/password-reset/confirm`,
    {
      reset_token: resetToken,
      new_password: newPassword,
      confirm_password: confirmPassword
    }
  )
  return response.data
}
