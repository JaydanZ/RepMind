import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { logoutUser } from '@/services/authAPI'
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
      if (action.payload) {
        state.error = action.payload
      }
    })
  }
})

export const userLogout = createAsyncThunk(
  'auth/removeToken',
  async (args, { rejectWithValue }) => {
    // Make call to api to invalidate refresh token
    try {
      await logoutUser()
      // If response was successful, remove the tokens from the cookie store
      await cookieStore.delete('auth_token')
      await cookieStore.delete('refresh_token')
      return
    } catch (error) {
      // If there was an error, cancel logout action
      if (isAxiosError(error)) {
        return rejectWithValue({
          errorMessage: error.message,
          errorCode: error.code
        })
      }
    }
  }
)

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
