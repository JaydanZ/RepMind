import axios from 'axios'
import { ProgramOptions, ProgramSubmission } from '@/types/programCreation'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

const LIMIT_EXPIRATION_TIME = 3600000 // 1 Hour

export const generateProgram = async (programInput: ProgramOptions) => {
  let freeLimitEnabled = false
  if (!programInput.isLoggedIn) {
    // Check if unauthenticated user has already called API
    const apiUsage = localStorage.getItem('programGenUsageTime')
    if (apiUsage) freeLimitEnabled = true
    // Set item in storage since its the users first time using the API
    const currentTime = new Date()

    localStorage.setItem(
      'programGenUsageTime',
      (currentTime.getTime() + LIMIT_EXPIRATION_TIME).toString()
    )
  }
  const submission: ProgramSubmission = {
    ...programInput,
    freeLimitEnabled
  }

  const response = await axios.post(`${BACKEND_API}/programs`, submission)
  return response.data
}

export const getExpireTime = () => {
  const lastSetExpireTime = localStorage.getItem('programGenUsageTime')
  const currentTime = new Date()
  if (
    lastSetExpireTime &&
    currentTime.getTime() > parseInt(lastSetExpireTime)
  ) {
    localStorage.removeItem('programGenUsageTime')
    return null
  }

  return lastSetExpireTime
}
