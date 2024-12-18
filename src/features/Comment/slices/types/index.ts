export interface CommentScreenState {
  comments: {
    isLoadingGetComments: boolean
    items: gapi.client.youtube.CommentThread[]
    nextPageToken: string | null
  }
  videoTitle: string
}

export const initialCommentScreenState: CommentScreenState = {
  comments: {
    isLoadingGetComments: false,
    items: [],
    nextPageToken: null
  },
  videoTitle: ''
}
