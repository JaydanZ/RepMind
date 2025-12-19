import axios from 'axios'
import { ProgramOptions, ProgramSubmission } from '@/types/programCreation'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const generateProgram = async (programInput: ProgramOptions) => {
  let freeLimitEnabled = false
  if (!programInput.isLoggedIn) {
    // Check if unauthenticated user has already called API
    const apiUsage = localStorage.getItem('hasUsedProgramGen')
    if (apiUsage) freeLimitEnabled = true
    // Set item in storage since its the users first time using the API
    localStorage.setItem('hasUsedProgramGen', 'true')
  }
  const submission: ProgramSubmission = {
    ...programInput,
    freeLimitEnabled
  }

  const response = await axios.post(`${BACKEND_API}/programs`, submission)
  return response.data
}
