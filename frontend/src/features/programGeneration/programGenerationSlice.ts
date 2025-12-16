import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ProgranGenResult } from '@/types/programCreation'

const initialState: ProgranGenResult = {
  program_structure: null,
  program_tips_and_goals: null
}

const programGenerationSlice = createSlice({
  name: 'programGeneration',
  initialState,
  reducers: {}
})

export default programGenerationSlice.reducer
