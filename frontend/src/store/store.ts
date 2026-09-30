import { useDispatch } from 'react-redux'
import {
  configureStore,
  createListenerMiddleware,
  isAnyOf
} from '@reduxjs/toolkit'
import { protectedApiSlice } from '@/services/protectedRoutesAPI'
import authReducer, { userLogin, userLogout } from '@/features/auth/authSlice'
import programGenerationReducer from '@/features/programGeneration/programGenerationSlice'

const authListener = createListenerMiddleware()
authListener.startListening({
  matcher: isAnyOf(userLogin.fulfilled, userLogout.fulfilled),
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(protectedApiSlice.util.resetApiState())
  }
})

export const store = configureStore({
  reducer: {
    [protectedApiSlice.reducerPath]: protectedApiSlice.reducer,
    auth: authReducer,
    programGeneration: programGenerationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(authListener.middleware)
      .concat(protectedApiSlice.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAsyncDispatch = () => useDispatch<AppDispatch>()
