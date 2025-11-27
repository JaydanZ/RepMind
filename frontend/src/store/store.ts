import { useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { protectedApiSlice } from '@/utils/protectedRoutesAPI'
import authReducer from '@/features/auth/authSlice'

export const store = configureStore({
  reducer: {
    [protectedApiSlice.reducerPath]: protectedApiSlice.reducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(protectedApiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAsyncDispatch = () => useDispatch<AppDispatch>()
