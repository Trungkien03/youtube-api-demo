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

  // const replyToComment = useCallback(
  //   async (parentId: string, replyText: string) => {
  //     if (!replyText.trim()) return

  //     const tempReply = {
  //       id: `temp-reply-${Date.now()}`,
  //       snippet: {
  //         textOriginal: replyText,
  //         authorDisplayName: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() || 'You',
  //         authorProfileImageUrl: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl() || '',
  //         publishedAt: new Date().toISOString()
  //       }
  //     }

  //     const updatedComments = comments.map((comment) => {
  //       if (comment.id === parentId) {
  //         return {
  //           ...comment,
  //           replies: {
  //             comments: [...(comment.replies?.comments || []), tempReply] // Sử dụng giá trị mặc định []
  //           }
  //         }
  //       }
  //       return comment
  //     })

  //     dispatch(setListComments(updatedComments))

  //     try {
  //       await gapi.client.youtube.comments.insert({
  //         part: 'snippet',
  //         resource: {
  //           snippet: {
  //             parentId, // ID của comment cha
  //             textOriginal: replyText
  //           }
  //         }
  //       })

  //       console.log('Reply added successfully!')
  //     } catch (error) {
  //       console.error('Error posting reply:', error)

  //       const rollbackComments = comments.map((comment) => {
  //         if (comment.id === parentId) {
  //           return {
  //             ...comment,
  //             replies: {
  //               comments: comment.replies?.comments.filter((reply) => reply.id !== tempReply.id) || []
  //             }
  //           }
  //         }
  //         return comment
  //       })

  //       dispatch(setListComments(rollbackComments))
  //     }
  //   },
  //   [comments]
  // )

  const replyToComment = useCallback(
    async (parentId: string, replyText: string) => {
      if (!replyText.trim()) return

      const tempReply = {
        id: `temp-reply-${Date.now()}`,
        parentId, // Gán parentId để xác định cha của reply này
        snippet: {
          textOriginal: replyText,
          authorDisplayName: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName() || 'You',
          authorProfileImageUrl: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getImageUrl() || '',
          publishedAt: new Date().toISOString()
        }
      }

      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          // Trả lời comment cấp cao nhất
          return {
            ...comment,
            replies: {
              comments: [...(comment.replies?.comments || []), tempReply]
            }
          }
        }

        if (comment.replies?.comments) {
          // Trả lời nested reply
          return {
            ...comment,
            replies: {
              comments: comment.replies.comments.map((reply) => {
                if (reply.id === parentId) {
                  return {
                    ...reply,
                    replies: {
                      comments: [...(reply.replies?.comments || []), tempReply]
                    }
                  }
                }
                return reply
              })
            }
          }
        }

        return comment
      })

      dispatch(setListComments(updatedComments))

      try {
        const response = await gapi.client.youtube.comments.insert({
          part: 'snippet',
          resource: {
            snippet: {
              parentId,
              textOriginal: replyText
            }
          }
        })

        console.log('Reply added successfully!')
      } catch (error) {
        console.error('Error posting reply:', error)

        // Rollback giao diện nếu API lỗi
        const rollbackComments = comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: {
                comments: comment.replies?.comments.filter((reply) => reply.id !== tempReply.id) || []
              }
            }
          }
          return comment
        })

        dispatch(setListComments(rollbackComments))
      }
    },
    [comments]
  )

  const deleteReply = useCallback(
    async (parentId: string, replyId: string) => {
      if (!replyId) {
        console.error('Reply ID is undefined. Cannot delete reply.')
        return
      }

      // Cập nhật giao diện tạm thời
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: {
              comments: comment.replies?.comments.filter((reply) => reply.id !== replyId) || []
            }
          }
        }
        return comment
      })

      dispatch(setListComments(updatedComments))

      try {
        // Gửi API để xóa reply
        await gapi.client.youtube.comments.delete({
          id: replyId
        })

        console.log(`Reply with ID: ${replyId} has been deleted.`)
      } catch (error) {
        console.error('Error deleting reply:', error)

        // Rollback giao diện nếu API lỗi
        const rollbackComments = comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: {
                comments: [...(comment.replies?.comments || []), comments.find((comment) => comment.id === replyId)]
              }
            }
          }
          return comment
        })

        dispatch(setListComments(rollbackComments))
      }
    },
    [comments]
  )

  return { postComment, deleteComment, newComment, setNewComment, videoId, replyToComment, deleteReply }
}

export default useCommentManagerViewModel
