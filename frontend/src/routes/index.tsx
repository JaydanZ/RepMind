import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

const backendUrl = import.meta.env.VITE_BACKEND_API_URL

function RouteComponent() {
  const registerBackend = async () => {
    const response = await axios(backendUrl)
    console.log(response)
  }

  registerBackend()

  return (
    <div className="flex w-full h-dvh justify-center items-center">
      <label className="text-white font-bold text-[3rem]">RepMind.</label>
    </div>
  )
}
