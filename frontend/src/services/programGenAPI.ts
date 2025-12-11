import axios from 'axios'
import { programOptions } from '@/types/programCreation'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const generateProgram = async (programInput: programOptions) => {
  const response = await axios.post(`${BACKEND_API}/programs`, programInput)
  return response.data
}
