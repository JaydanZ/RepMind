import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

const backendUrl = import.meta.env.VITE_BACKEND_API_URL

function RouteComponent() {
  useEffect(() => {
    const response = axios.get(backendUrl)
    console.log(response)
  }, [])

  return (
    <div className="flex w-full h-dvh justify-center items-center">
      <label className="text-white font-bold text-[3rem]">RepMind.</label>
    </div>
  )
}
