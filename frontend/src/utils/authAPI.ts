import axios from 'axios'
import { SignupUser } from '@/types/auth'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const signupUser = async (userCredentials: SignupUser) => {
  const response = await axios.post(
    `${BACKEND_API}/users/createuser`,
    userCredentials
  )
  return response
}
