import { IoHomeOutline } from 'react-icons/io5'
import { LuDumbbell } from 'react-icons/lu'
import { RiUserCommunityLine } from 'react-icons/ri'
import { AiOutlineLogout } from 'react-icons/ai'
import { AiOutlineLogin } from 'react-icons/ai'
import { IoPersonOutline } from 'react-icons/io5'

interface routeData {
  id: string
  href: string
  icon: React.ReactNode
  params: object
}

export const LOGGED_IN_ROUTES: routeData[] = [
  {
    id: 'Home',
    href: '/',
    icon: <IoHomeOutline />,
    params: {}
  },
  {
    id: 'My Workouts',
    href: '/userworkouts',
    icon: <LuDumbbell />,
    params: {}
  },
  {
    id: 'Profile',
    href: '/profile',
    icon: <IoPersonOutline />,
    params: {}
  },
  {
    id: 'Community',
    href: '/community',
    icon: <RiUserCommunityLine />,
    params: {}
  },
  {
    id: 'Logout',
    href: '/logout',
    icon: <AiOutlineLogout />,
    params: {}
  }
]
export const LOGGED_OUT_ROUTES = [
  {
    id: 'Home',
    href: '/',
    icon: <IoHomeOutline />,
    params: {}
  },
  {
    id: 'Login',
    href: '/login',
    icon: <AiOutlineLogin />,
    params: {}
  }
]
