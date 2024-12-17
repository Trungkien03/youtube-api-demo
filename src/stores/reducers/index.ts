import { combineReducers } from '@reduxjs/toolkit'

import dialogSlice from '../slices/dialogSlice'

const rootReducer = combineReducers({
  dialogState: dialogSlice
})
export default rootReducer
