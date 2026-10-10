export interface UserCredentials {
  email: string
  password: string
}

export interface SignupUser extends UserCredentials {
  username: string
}

export interface AuthState {
  loading: boolean
  isLoggedIn: boolean
  userInfo: object
  userToken: string | null | undefined
  error: object | null
  success: boolean
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
  confirm_password: string
}

export interface AuthorizedResponse {
  token_data: { access_token: string; token_type: string }
  refresh_token_data: string
  username: string
  email: string
}
