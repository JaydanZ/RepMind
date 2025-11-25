import axios from 'axios'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

export const getProfileData = async (token: string) => {
  const response = await axios.get(`${BACKEND_API}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
