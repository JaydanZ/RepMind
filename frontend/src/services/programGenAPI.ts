import axios from 'axios'
import { ProgramOptions, ProgramSubmission } from '@/types/programCreation'
import { API_BASE_URL } from './apiConfig'

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

  const response = await axios.post(
    `${API_BASE_URL}/programs/generate`,
    submission
  )
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
