import { useState, useLayoutEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getProfileData } from '@/utils/profileAPI'

export const Route = createFileRoute('/profile')({
  component: RouteComponent
})

function RouteComponent() {
  const [data, setData] = useState()

  useLayoutEffect(() => {
    const fetchData = async () => {
      const response = await getProfileData()
      setData(response)
    }
    fetchData()
  }, [])
  return (
    <div className="flex justify-center items-center pt-32">
      <div className="text-white text-2rem">{JSON.stringify(data)}</div>
    </div>
  )
}
