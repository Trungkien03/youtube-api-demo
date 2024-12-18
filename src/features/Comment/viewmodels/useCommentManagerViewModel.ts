import { useAppDispatch, useAppSelector } from '@app/stores'
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

      const tempComment = {
        id: `temp-${Date.now()}`,
        snippet: {
          topLevelComment: {
            snippet: {
              textOriginal: newComment,
              authorDisplayName: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() || 'You',
              authorProfileImageUrl:
                gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl() || '',
              publishedAt: new Date().toISOString()
            }
          }
        },
        replies: null
      }

      dispatch(setListComments([tempComment, ...comments]))

      setNewComment('')

      try {
        await gapi.client.youtube.commentThreads.insert({
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
        console.log('Insert Comment Successfully!')
      } catch (error) {
        console.error('Error posting comment:', error)
        dispatch(setListComments(comments.filter((comment) => comment.id !== tempComment.id)))
      }
    },
    [newComment]
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
  return { postComment, deleteComment, newComment, setNewComment, videoId }
}

export default useCommentManagerViewModel
