import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type UserData = {
  name: string
  email: string
  avatar?: string
}

type UserState = {
  token: string | null
  role: string | null
  isAuthenticated: boolean
  data: UserData | null
}

const initialState: UserState = {
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  isAuthenticated: !!localStorage.getItem('token'),
  data: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ token: string; role: string }>,
    ) {
      state.token = action.payload.token
      state.role = action.payload.role
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('role', action.payload.role)
    },
    logout(state) {
      state.token = null
      state.role = null
      state.isAuthenticated = false
      state.data = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    },
    setUserData(state, action: PayloadAction<UserData>) {
      state.data = action.payload
    },
  },
})

export const { loginSuccess, logout, setUserData } = userSlice.actions
export default userSlice.reducer
