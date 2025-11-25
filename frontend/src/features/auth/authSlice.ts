import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthState } from '@/types/auth'

interface TokenData {
  access_token: string
  token_type: string
}

interface LoginResponse {
  email: string
  username: string
  token_data: TokenData
  refresh_token: string
}

// Initialize userToken from cookie store on page load
const tokenInStorage = await cookieStore.get('auth_token')
const userToken = tokenInStorage ? tokenInStorage?.value : null

const initialState: AuthState = {
  loading: false,
  userInfo: {},
  userToken,
  error: null,
  success: false
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken')
      state.loading = false
      state.userInfo = {}
      state.userToken = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Handle token storage after login
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.userInfo = {
        username: action.payload.username,
        email: action.payload.email
      }

      state.userToken = action.payload.token_data.access_token
    })
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true
      state.error = null
    })
  }
})

export const userLogin = createAsyncThunk(
  'auth/storeToken',
  async (data: LoginResponse) => {
    // store token & refresh token in http cookies
    await cookieStore.set('auth_token', data.token_data.access_token)
    await cookieStore.set('refresh_token', data.refresh_token)

    return data
  }
)

export const { logout } = authSlice.actions

export default authSlice.reducer
