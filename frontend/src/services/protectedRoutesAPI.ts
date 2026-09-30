import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryApi
} from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store/store'
import { refreshAccessToken } from '@/features/auth/authSlice'
import { genNewAccessToken } from './authAPI'
import { Profile } from '@/types/profile'
import {
  PreviousPerformance,
  SubmitWorkoutResponse,
  WorkoutHistoryResponse,
  WorkoutSubmission
} from '@/types/workoutSession'

const BACKEND_API = import.meta.env.VITE_BACKEND_API_URL

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_API,
  credentials: 'include',
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).auth.userToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  }
})

const protectedRoutesApi = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions)

  // If status was 401, we need to generate a new access token
  if (result.error && result.error.status === 401) {
    const refreshedToken = await genNewAccessToken()
    if (refreshedToken) {
      // store the newly refreshed token
      await api.dispatch(refreshAccessToken(refreshedToken.access_token))

      // retry the original query
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const protectedApiSlice = createApi({
  baseQuery: protectedRoutesApi,
  tagTypes: ['Profile', 'PreviousPerformance', 'WorkoutHistory'],
  endpoints: (builder) => ({
    getProfileData: builder.query<Profile, void>({
      query: () => '/programs/',
      keepUnusedDataFor: 5,
      providesTags: ['Profile']
    }),
    getPreviousPerformance: builder.query<
      PreviousPerformance,
      { names: string[]; until: string }
    >({
      query: ({ names, until }) => {
        const params = new URLSearchParams({ until })
        names.forEach((name) => params.append('names', name))
        return `/workouts/previous?${params.toString()}`
      },
      providesTags: ['PreviousPerformance']
    }),
    getWorkoutHistory: builder.query<WorkoutHistoryResponse, { limit: number }>(
      {
        query: ({ limit }) =>
          `/workouts/history?${new URLSearchParams({ limit: String(limit) })}`,
        providesTags: ['WorkoutHistory']
      }
    ),
    submitWorkout: builder.mutation<SubmitWorkoutResponse, WorkoutSubmission>({
      query: (body) => ({ url: '/workouts/', method: 'POST', body }),
      invalidatesTags: ['Profile', 'PreviousPerformance', 'WorkoutHistory']
    })
  })
})

// Export generated hooks
export const {
  useGetProfileDataQuery,
  useGetPreviousPerformanceQuery,
  useGetWorkoutHistoryQuery,
  useSubmitWorkoutMutation
} = protectedApiSlice
