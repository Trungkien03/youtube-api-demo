import { createSlice } from '@reduxjs/toolkit'
import { initialCommentScreenState } from './types'
import { getListComments } from './actions'

const commentVideoSlice = createSlice({
  name: 'comments',
  initialState: initialCommentScreenState,
  reducers: {
    setVideoTitle: (state, action) => {
      state.videoTitle = action.payload
    },
    setListComments: (state, action) => {
      state.comments.items = action.payload
    },
    resetCommentActivityState: () => initialCommentScreenState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getListComments.pending, (state) => {
        state.comments.isLoadingGetComments = true
      })
      .addCase(getListComments.fulfilled, (state, action) => {
        state.comments.items = [...state.comments.items, ...(action.payload.result.items ?? [])]
        state.comments.nextPageToken = action.payload.result.nextPageToken ?? null
        state.comments.isLoadingGetComments = false
      })

      .addCase(getListComments.rejected, (state) => {
        state.comments.isLoadingGetComments = false
      })
  }
})

export const { resetCommentActivityState, setVideoTitle, setListComments } = commentVideoSlice.actions
export default commentVideoSlice.reducer
