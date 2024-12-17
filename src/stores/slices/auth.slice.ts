import { createSlice } from '@reduxjs/toolkit'
import { User } from '../models'

interface AuthState {
  user: User | null
}

const initialAuthState: AuthState = {
  user: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { setUser } = authSlice.actions
export default authSlice.reducer
