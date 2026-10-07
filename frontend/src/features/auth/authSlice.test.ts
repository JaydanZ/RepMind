import { beforeEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'

const deleteCookie = vi.fn(async () => undefined)

// authSlice reads the cookie store at import time
vi.stubGlobal('cookieStore', {
  get: async () => null,
  set: async () => undefined,
  delete: deleteCookie
})

const logoutUser = vi.fn()
vi.mock('@/services/authAPI', () => ({ logoutUser }))

const { default: authReducer, userLogout } = await import('./authSlice')

const makeStore = () => configureStore({ reducer: { auth: authReducer } })

describe('userLogout', () => {
  beforeEach(() => {
    deleteCookie.mockClear()
    logoutUser.mockReset()
  })

  it('removes the auth cookies when the API call succeeds', async () => {
    logoutUser.mockResolvedValue({})
    const result = await makeStore().dispatch(userLogout())

    expect(userLogout.fulfilled.match(result)).toBe(true)
    expect(deleteCookie).toHaveBeenCalledWith('auth_token')
    expect(deleteCookie).toHaveBeenCalledWith('refresh_token')
  })

  it('rejects and keeps the cookies when a non-axios error is thrown', async () => {
    logoutUser.mockRejectedValue(new TypeError('cookieStore unavailable'))
    const store = makeStore()
    const result = await store.dispatch(userLogout())

    expect(userLogout.rejected.match(result)).toBe(true)
    expect(deleteCookie).not.toHaveBeenCalled()
    expect(store.getState().auth.error).toEqual({
      errorMessage: 'cookieStore unavailable',
      errorCode: undefined
    })
  })
})
