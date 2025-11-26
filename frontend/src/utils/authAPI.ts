import axios from 'axios'
import { SignupUser } from '@/types/auth'
import { UserCredentials } from '../types/auth'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const signupUser = async (userCredentials: SignupUser) => {
  const response = await axios.post(
    `${BACKEND_API}/auth/createuser`,
    userCredentials
  )
  return response
}

export const loginUser = async (userCredentials: UserCredentials) => {
  const response = await axios.post(
    `${BACKEND_API}/auth/login`,
    userCredentials
  )
  return response
}

export const genNewAccessToken = async (token: string | null | undefined) => {
  const response = await axios.post(`${BACKEND_API}/auth/token`, {
    refresh_token: token
  })
  return response.data
}
