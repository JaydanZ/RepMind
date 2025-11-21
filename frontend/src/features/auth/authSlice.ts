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
}

const initialState: AuthState = {
  loading: false,
  userInfo: {},
  userToken: null,
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
  }
})

export const userLogin = createAsyncThunk(
  'auth/storeToken',
  async (data: LoginResponse) => {
    // store token in local storage
    localStorage.setItem('userToken', data.token_data.access_token)
    return data
  }
)

export default authSlice.reducer
