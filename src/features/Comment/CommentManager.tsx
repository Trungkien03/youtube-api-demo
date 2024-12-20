import { useAppSelector } from '@app/stores'
import React from 'react'
import CommentItem from './components/CommentItem'
import useCommentManagerViewModel from './viewmodels/useCommentManagerViewModel'

const CommentManager: React.FC = () => {
  const {
    comments: { isLoadingGetComments, items: comments },
    videoTitle
  } = useAppSelector((state) => state.videoComment)

  const {
    deleteComment,
    postComment,
    newComment,
    setNewComment,
    videoId,
    replyToComment,
    deleteReply,
    isLoadingPostingComment,
    updateComment,
    updateReply
  } = useCommentManagerViewModel()

  return (
    <div className='p-4'>
      {/* Video Title */}
      <h2 className='text-2xl font-bold mb-4 text-center text-white'>{videoTitle}</h2>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
        {/* Left Side - Video */}
        <div className='lg:col-span-2 flex justify-center'>
          <div className='w-full max-w-2xl'>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title='YouTube Video'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='w-full h-[240px] md:h-[360px] lg:h-[400px] rounded-lg shadow-lg'
            ></iframe>
          </div>
        </div>

        {/* Right Side - Comments */}
        <div className='lg:col-span-3'>
          {/* Add Comment Form */}
          <form className='mb-6' onSubmit={postComment}>
            <div className='py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700'>
              <label className='sr-only'>Your comment</label>
              <textarea
                id='comment'
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)} // Liên kết state newComment
                className='px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-900'
                placeholder='Write a comment...'
                required
              ></textarea>
            </div>
            <button
              type='submit'
              className='inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800'
            >
              Post comment
            </button>
          </form>

          {/* Comments List */}
          <h3 className='text-xl font-bold mb-4 text-white'>Comments</h3>
          {isLoadingPostingComment && <p className='text-gray-400 text-center my-3'>Posting comment...</p>}
          {isLoadingGetComments ? (
            <p className='text-gray-400 text-center'>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment, index) => {
              const commentSnippet = comment.snippet?.topLevelComment?.snippet
              return (
                <CommentItem
                  commentSnippet={commentSnippet}
                  replies={comment.replies?.comments ?? []}
                  key={index}
                  commentId={comment.id ?? ''}
                  onDelete={() => deleteComment(comment.id)}
                  onReply={(replyText) => replyToComment(comment.id ?? '', replyText)}
                  onDeleteReply={(replyId) => deleteReply(comment.id ?? '', replyId)}
                  onUpdate={updateComment}
                  onUpDateReply={(replyId, updatedText) => updateReply(comment.id ?? '', replyId, updatedText)}
                />
              )
            })
          ) : (
            <p className='text-gray-400 text-center'>No comments found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentManager
