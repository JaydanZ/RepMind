export interface UserCredentials {
  email: string
  password: string
}

export interface SignupUser extends UserCredentials {
  username: string
}
