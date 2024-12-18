import { combineReducers } from '@reduxjs/toolkit'

import dialogSlice from '../slices/dialog.slice'
import authSlice from '../slices/auth.slice'
import channelActivitySlice from '../../features/Reports/slices'

const rootReducer = combineReducers({
  dialogState: dialogSlice,
  authState: authSlice,
  channelActivity: channelActivitySlice
})
export default rootReducer
