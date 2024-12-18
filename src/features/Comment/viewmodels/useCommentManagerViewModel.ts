import { DialogType } from '@app/common/types/dialogSlice.type'
import { useAppDispatch, useAppSelector } from '@app/stores'
import { showDialog } from '@app/stores/slices/dialog.slice'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { resetCommentActivityState, setListComments, setVideoTitle } from '../slices'
import { getListComments } from '../slices/actions'

const useCommentManagerViewModel = () => {
  const { videoId } = useParams<{ videoId: string }>()

  const [newComment, setNewComment] = useState<string>('')

  const {
    comments: { items: comments }
  } = useAppSelector((state) => state.videoComment)
  const dispatch = useAppDispatch()

  const fetchVideoTitle = useCallback(async () => {
    try {
      const response = await gapi.client.youtube.videos.list({
        part: 'snippet',
        id: videoId
      })

      const title = response.result.items?.[0]?.snippet?.title || 'Unknown Video Title'
      dispatch(setVideoTitle(title))
    } catch (error) {
      console.error('Error fetching video title:', error)
      setVideoTitle('Error loading title')
    }
  }, [])

  const fetchComments = useCallback(async (videoId: string) => {
    dispatch(getListComments({ videoId }))
  }, [])

  const postComment = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!newComment.trim()) return

      try {
        const response = await gapi.client.youtube.commentThreads.insert({
          part: 'snippet',
          resource: {
            snippet: {
              videoId: videoId,
              topLevelComment: {
                snippet: {
                  textOriginal: newComment
                }
              }
            }
          }
        })

        const newCommentThread = response.result // The new comment thread from the API response

        // Append the new comment to the current list
        const updatedComments = [newCommentThread, ...comments]
        dispatch(setListComments(updatedComments))

        setNewComment('')
        console.log('Comment added successfully!')
      } catch (error) {
        console.error('Error posting comment:', error)

        dispatch(
          showDialog({
            title: 'Error',
            content: 'Failed to post the comment. Please try again.',
            type: DialogType.ERROR
          })
        )
      }
    },
    [newComment, comments, videoId]
  )

  const deleteComment = useCallback(
    async (commentId: string | undefined) => {
      if (!commentId) {
        console.error('Comment ID is undefined. Cannot delete comment.')
        return
      }

      const updatedComments = comments.filter((comment) => comment.snippet?.topLevelComment?.id !== commentId)
      dispatch(setListComments(updatedComments))

      try {
        await gapi.client.youtube.comments.delete({
          id: commentId
        })
        console.log(`Comment with ID: ${commentId} has been deleted.`)
      } catch (error) {
        console.error('Error deleting comment:', error)
        dispatch(
          showDialog({
            title: 'Error',
            content: 'Cannot Delete Comment Right Now!',
            type: DialogType.ERROR
          })
        )
        dispatch(setListComments(comments))
      }
    },
    [comments]
  )

  useEffect(() => {
    if (videoId) {
      fetchVideoTitle()
      fetchComments(videoId)
    }

    return () => {
      dispatch(resetCommentActivityState())
    }
  }, [])

  const replyToComment = useCallback(
    async (parentId: string, replyText: string) => {
      if (!replyText.trim()) return

      try {
        // Send API request to post the reply
        const response = await gapi.client.youtube.comments.insert({
          part: 'snippet',
          resource: {
            snippet: {
              parentId,
              textOriginal: replyText
            }
          }
        })

        const newReply = response.result

        const updatedComments = comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: {
                comments: [...(comment.replies?.comments || []), newReply]
              }
            }
          }
          return comment
        })

        dispatch(setListComments(updatedComments))

        console.log('Reply added successfully!')
      } catch (error) {
        console.error('Error posting reply:', error)

        // Show error dialog
        dispatch(
          showDialog({
            title: 'Error',
            content: 'Failed to add reply. Please try again.',
            type: DialogType.ERROR
          })
        )
      }
    },
    [comments]
  )

  const deleteReply = async (parentId: string, replyId: string) => {
    if (!replyId) {
      console.error('Reply ID is undefined. Cannot delete reply.')
      return
    }

    // Update UI temporarily by filtering out the reply
    const updatedComments = comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: {
            comments: comment.replies?.comments?.filter((reply) => reply.id !== replyId) || []
          }
        }
      }
      return comment
    })

    dispatch(setListComments(updatedComments))

    try {
      await gapi.client.youtube.comments.delete({
        id: replyId
      })

      console.log(`Reply with ID: ${replyId} has been deleted.`)
    } catch (error) {
      console.error('Error deleting reply:', error)

      // Rollback UI state if the API request fails
      const rollbackComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: {
              comments: [...(comment.replies?.comments || []), comments.find((reply) => reply.id === replyId)].filter(
                Boolean
              )
            }
          }
        }
        return comment
      })

      dispatch(setListComments(rollbackComments))
    }
  }

  return { postComment, deleteComment, newComment, setNewComment, videoId, replyToComment, deleteReply }
}

export default useCommentManagerViewModel
