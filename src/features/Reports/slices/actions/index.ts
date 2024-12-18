import { createAsyncThunk } from '@reduxjs/toolkit'

export const getListActivities = createAsyncThunk(
  'activities/getListActivities',
  async ({ pageToken }: { pageToken?: string }, { rejectWithValue }) => {
    try {
      const response = await gapi.client.youtube.activities.list({
        part: 'snippet,contentDetails',
        mine: true,
        maxResults: 10,
        pageToken: pageToken || undefined
      })

      return response
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue({ message: error.response.data.message })
      }
      return rejectWithValue({
        message: 'Fail to get list activities ! please try again!'
      })
    }
  }
)

export const getStats = createAsyncThunk('activities/getStats', async (_, { rejectWithValue }) => {
  try {
    console.log('Attempting to fetch channel stats...')

    const response = await gapi.client.youtube.channels.list({
      part: 'snippet,statistics,brandingSettings',
      mine: true
    })

    return response
  } catch (error: any) {
    console.error('Error fetching stats:', error)

    if (error.response && error.response.data) {
      return rejectWithValue({ message: error.response.data.message })
    }
    return rejectWithValue({
      message: 'Fail to get stats! Please try again!'
    })
  }
})
