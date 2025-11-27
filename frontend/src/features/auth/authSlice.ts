import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { logoutUser } from '@/utils/authAPI'
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
const tokenInStore = await cookieStore.get('auth_token')
const userToken = tokenInStore ? tokenInStore?.value : null

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
  reducers: {},
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

    // Handle token storage after refresh
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.userToken = action.payload
    })

    // Handle user logout
    builder.addCase(userLogout.fulfilled, (state) => {
      state.loading = false
      state.userInfo = {}
      state.userToken = null
      state.error = null
    })

    builder.addCase(userLogout.rejected, (state, action) => {
      console.error(action.payload)
    })
  }
})

export const userLogout = createAsyncThunk('auth/removeToken', async () => {
  // Make call to api to invalidate refresh token
  const response = await logoutUser()

  // If there was an error, cancel logout action
  if (response.error) Promise.reject(response.error)

  // If response was successful, remove the tokens from the cookie store
  await cookieStore.delete('auth_token')
  await cookieStore.delete('refresh_token')

  return
})

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (token: string) => {
    // store new access token
    await cookieStore.set('auth_token', token)
    return token
  }
)

export const userLogin = createAsyncThunk(
  'auth/storeToken',
  async (data: LoginResponse) => {
    // store token & refresh token in http cookies
    await cookieStore.set('auth_token', data.token_data.access_token)
    await cookieStore.set('refresh_token', data.refresh_token)

    return data
  }
)

export default authSlice.reducer
