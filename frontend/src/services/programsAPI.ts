import axios from 'axios'
import { ProgramStruct } from '@/types/programCreation'
import { genNewAccessToken } from './authAPI'
import { router } from '@/App'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const protectedApi = axios.create({
  baseURL: `${BACKEND_API}`,
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

export const programImport = async (program: ProgramStruct) => {
  const response = await protectedApi.post(
    `${BACKEND_API}/programs/import`,
    program
  )
  return response.data
}
