import { createAsyncThunk } from '@reduxjs/toolkit'

export const getListComments = createAsyncThunk(
  'comments/getListComments',
  async ({ videoId }: { videoId: string }, { rejectWithValue }) => {
    try {
      const response = await gapi.client.youtube.commentThreads.list({
        part: 'snippet,replies',
        videoId: videoId,
        maxResults: 10
      })

      return response
    } catch (error: any) {
      return rejectWithValue({
        message: 'Fail to get list comments ! please try again!'
      })
    }
  }
)
