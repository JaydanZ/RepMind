import axios from 'axios'
import { ProgramOptions } from '@/types/programCreation'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const generateProgram = async (programInput: ProgramOptions) => {
  if (!programInput.isLoggedIn) {
    // Check if unauthenticated user has already called API
    const apiUsage = localStorage.getItem('hasUsedProgramGen')
    if (apiUsage)
      throw new Error(
        'API usage limit has been reached. Please login / register to continue using this feature'
      )
    // Set item in storage since its the users first time using the API
    localStorage.setItem('hasUsedProgramGen', 'true')
  }
  const response = await axios.post(`${BACKEND_API}/programs`, programInput)
  return response.data
}
