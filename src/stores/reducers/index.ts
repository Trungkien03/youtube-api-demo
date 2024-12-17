import { combineReducers } from '@reduxjs/toolkit'

import dialogSlice from '../slices/dialog.slice'
import authSlice from '../slices/auth.slice'

const rootReducer = combineReducers({
  dialogState: dialogSlice,
  authState: authSlice
})
export default rootReducer
