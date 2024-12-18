export interface ActivitiesScreenState {
  activities: {
    isLoadingGetActivities: boolean
    items: gapi.client.youtube.Activity[]
    nextPageToken: string | null
  }
  stats: {
    isLoadingGetStats: boolean
    items: gapi.client.youtube.Channel[]
  }
}

export const initialActivitiesScreenState: ActivitiesScreenState = {
  activities: {
    isLoadingGetActivities: false,
    items: [],
    nextPageToken: null
  },
  stats: {
    isLoadingGetStats: false,
    items: []
  }
}
