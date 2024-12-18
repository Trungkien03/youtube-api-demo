export interface CommentScreenState {
  comments: {
    isLoadingGetComments: boolean
    items: gapi.client.youtube.CommentThread[]
    nextPageToken: string | null
  }
  isLoadingPostingComment: boolean
  isLoadingReplyComment: boolean
  videoTitle: string
}

export const initialCommentScreenState: CommentScreenState = {
  comments: {
    isLoadingGetComments: false,
    items: [],
    nextPageToken: null
  },
  isLoadingPostingComment: false,
  isLoadingReplyComment: false,
  videoTitle: ''
}
