import { isAxiosError } from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { generateProgram } from '@/services/programGenAPI'
import { ProgranGenResult, ProgramOptions } from '@/types/programCreation'

interface ProgramGenerationState {
  loading: boolean
  aiProgram: ProgranGenResult | undefined
  error: object | null
}

const initialState: ProgramGenerationState = {
  loading: false,
  aiProgram: undefined,
  error: null
}

const programGenerationSlice = createSlice({
  name: 'programGeneration',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle storing result
    builder.addCase(
      getAIProgram.fulfilled,
      (state: ProgramGenerationState, action) => {
        state.aiProgram = action.payload
        state.loading = false
        state.error = null
      }
    ),
      builder.addCase(
        getAIProgram.rejected,
        (state: ProgramGenerationState, action) => {
          if (action.payload) {
            state.error = action.payload
          } else {
            state.error = {
              errorMessage: 'An error has occured generating your program',
              errorCode: 400
            }
          }
        }
      )
  }
})

export const getAIProgram = createAsyncThunk(
  'programGeneration/getGeneratedProgram',
  async (programOptions: ProgramOptions, { rejectWithValue }) => {
    try {
      const response = await generateProgram(programOptions)
      return response as ProgranGenResult
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

export default programGenerationSlice.reducer
