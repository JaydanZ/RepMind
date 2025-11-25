import { useState, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import { createFileRoute } from '@tanstack/react-router'
import { getProfileData } from '@/utils/profileAPI'
import { RootState } from '@/store/store'

export const Route = createFileRoute('/profile')({
  component: RouteComponent
})

function RouteComponent() {
  const [data, setData] = useState()
  const accessToken = useSelector((state: RootState) => state.auth.userToken)

  useLayoutEffect(() => {
    const fetchData = async () => {
      const response = await getProfileData(accessToken)
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
