import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PreferenceState {
  category: string
  spicy: string
}

const initialState: PreferenceState = {
  category: '한식',
  spicy: '매움',
}

const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload
    },
    setSpicy: (state, action: PayloadAction<string>) => {
      state.spicy = action.payload
    },
  },
})

export const { setCategory, setSpicy } = preferenceSlice.actions
export default preferenceSlice.reducer
