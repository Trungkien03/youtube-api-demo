import { combineReducers } from '@reduxjs/toolkit'

import dialogSlice from '../slices/dialog.slice'
import authSlice from '../slices/auth.slice'
import channelActivitySlice from '../../features/Reports/slices'
import commentVideoSlice from '../../features/Comment/slices'

const rootReducer = combineReducers({
  dialogState: dialogSlice,
  authState: authSlice,
  channelActivity: channelActivitySlice,
  videoComment: commentVideoSlice
})
export default rootReducer
