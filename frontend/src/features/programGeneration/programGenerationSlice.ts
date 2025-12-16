import { isAxiosError } from 'axios'
import { createSlice, createAsyncThunk, createReducer } from '@reduxjs/toolkit'

import { generateProgram } from '@/services/programGenAPI'
import { ProgranGenResult, ProgramOptions } from '@/types/programCreation'

const initialState: ProgranGenResult = {
  program_structure: null,
  program_tips_and_goals: null
}

const programGenerationSlice = createSlice({
  name: 'programGeneration',
  initialState,
  reducers: {}
})

export const getAIProgram = createAsyncThunk(
  'programGeneration/getGeneratedProgram',
  async (programOptions: ProgramOptions, { rejectWithValue }) => {
    try {
      const response = await generateProgram(programOptions)
      console.log(response)
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
