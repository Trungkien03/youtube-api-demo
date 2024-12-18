import { createSlice } from '@reduxjs/toolkit'
import { getListActivities, getStats } from './actions'
import { initialActivitiesScreenState } from './types'

const channelActivitySlice = createSlice({
  name: 'activities',
  initialState: initialActivitiesScreenState,
  reducers: {
    resetActivitiesState: () => initialActivitiesScreenState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListActivities.pending, (state) => {
        state.activities.isLoadingGetActivities = true
      })
      .addCase(getListActivities.fulfilled, (state, action) => {
        state.activities.items = [...state.activities.items, ...(action.payload.result.items ?? [])]
        state.activities.nextPageToken = action.payload.result.nextPageToken ?? undefined
        state.activities.isLoadingGetActivities = false
      })

      .addCase(getListActivities.rejected, (state) => {
        state.activities.isLoadingGetActivities = false
      })

    builder
      .addCase(getStats.pending, (state) => {
        state.stats.isLoadingGetStats = true
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.stats.items = action.payload.result.items ?? []
        state.stats.isLoadingGetStats = false
      })
      .addCase(getStats.rejected, (state) => {
        state.stats.isLoadingGetStats = false
      })
  }
})

export const { resetActivitiesState } = channelActivitySlice.actions
export default channelActivitySlice.reducer
