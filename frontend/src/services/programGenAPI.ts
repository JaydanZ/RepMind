import axios from 'axios'
import { ProgramOptions } from '@/types/programCreation'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const generateProgram = async (programInput: ProgramOptions) => {
  const response = await axios.post(`${BACKEND_API}/programs`, programInput)
  return response.data
}
