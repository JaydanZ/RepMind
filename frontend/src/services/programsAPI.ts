import axios from 'axios'
import {
  ProgramActiveResponse,
  ProgramStruct,
  WorkoutProgram
} from '@/types/programCreation'
import { genNewAccessToken } from './authAPI'
import { router } from '@/App'
import { API_BASE_URL } from './apiConfig'

export const protectedApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

protectedApi.interceptors.request.use(
  async (config) => {
    const tokenInStore = await cookieStore.get('auth_token')
    const token = tokenInStore ? tokenInStore?.value : null

    if (token) config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

protectedApi.interceptors.response.use(
  async (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    try {
      if (error.response && error.response.status === 401) {
        const refreshedToken = await genNewAccessToken()
        const newAccessToken = refreshedToken
          ? refreshedToken.access_token
          : null
        await cookieStore.set('auth_token', newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return await axios(originalRequest)
      }
    } catch (refreshError) {
      router.navigate({
        to: '/login'
      })
    }
  }
)

export const getUsersPrograms = async () => {
  const response = await protectedApi.get(`${API_BASE_URL}/users/me`)
  return response.data
}

export const programImport = async (program: ProgramStruct) => {
  const response = await protectedApi.post(
    `${API_BASE_URL}/programs/import`,
    program
  )
  return response.data
}

export const setProgramActive = async (
  program: WorkoutProgram
): Promise<ProgramActiveResponse> => {
  const response = await protectedApi.put<ProgramActiveResponse>(
    `${API_BASE_URL}/users/me/active-program`,
    {
      program_id: program.id
    }
  )
  return response.data
}

export const deleteProgram = async (programId: string) => {
  const response = await protectedApi.delete(
    `${API_BASE_URL}/programs/${encodeURIComponent(programId)}`
  )
  return response.data
}
