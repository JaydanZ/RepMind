export interface UserCredentials {
  email: string
  password: string
}

export interface SignupUser extends UserCredentials {
  username: string
}

export interface AuthState {
  loading: boolean
  userInfo: object
  userToken: string | null | undefined
  error: object | null
  success: boolean
}
