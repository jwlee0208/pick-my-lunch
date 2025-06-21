import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CountryState {
  countryCode: string | null
}

const initialState: CountryState = {
  countryCode: null,
}

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setCountryCode: (state, action: PayloadAction<string | null>) => {
      state.countryCode = action.payload
    },
  },
})

export const { setCountryCode } = countrySlice.actions
export default countrySlice.reducer
