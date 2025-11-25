import axios from 'axios'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const getProfileData = async () => {
  const response = await axios.get(`${BACKEND_API}/profile`)
  return response.data
}
