import axios from 'axios'
import { ProgramStruct } from '@/types/programCreation'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const programImport = async (program: ProgramStruct) => {
  const tokenInStore = await cookieStore.get('auth_token')
  const token = tokenInStore ? tokenInStore?.value : null
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(
    `${BACKEND_API}/programs/import`,
    program,
    config
  )
  return response.data
}
