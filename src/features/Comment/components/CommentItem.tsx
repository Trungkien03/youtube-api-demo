import { fDate } from '@app/utils/format-time'
import useCommentItemViewModel from '../viewmodels/useCommentItemViewModel'
import SubCommentItem from './SubCommentItem'

type CommentItemProps = {
  commentSnippet: gapi.client.youtube.CommentSnippet | undefined
  commentId: string
  replies: gapi.client.youtube.Comment[]
  onDelete?: () => void
  onReply?: (replyText: string, parentId: string) => void
  onDeleteReply?: (replyId: string) => void
  onUpdate?: (commentId: string, updatedText: string) => void
  onUpDateReply: (replyId: string, updatedText: string) => Promise<void>
}

const CommentItem = ({
  commentSnippet,
  replies,
  onDelete,
  onReply,
  onDeleteReply,
  onUpdate,
  commentId,
  onUpDateReply
}: CommentItemProps) => {
  const {
    isDropdownOpen,
    isEditing,
    isReplying,
    showReplies,
    commentText,
    replyText,
    editRef,
    toggleDropdown,
    handleEdit,
    handleEditCancel,
    handleReply,
    handleReplyCancel,
    handleReplySubmit,
    toggleReplies,
    setCommentText,
    setReplyText
  } = useCommentItemViewModel({
    commentSnippet,
    commentId,
    replies,
    onDelete,
    onReply
  })

  const handleEditSubmit = () => {
    if (commentText.trim() && onUpdate) {
      onUpdate(commentId, commentText)
      handleEditCancel()
    }
  }

  return (
    <article className='p-6 text-base bg-white rounded-lg dark:bg-gray-900 mb-2'>
      {/* Comment Header */}
      <footer className='flex justify-between items-center mb-2'>
        <div className='flex items-center'>
          <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold'>
            <img
              className='mr-2 w-6 h-6 rounded-full'
              src={commentSnippet?.authorProfileImageUrl || 'default-image-url.jpg'}
              alt={commentSnippet?.authorDisplayName}
            />
            {commentSnippet?.authorDisplayName}
          </p>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            <time dateTime={commentSnippet?.publishedAt} title='Published Date'>
              {fDate(commentSnippet?.publishedAt)}
            </time>
          </p>
        </div>

        {/* Dropdown Menu */}
        <div className='relative'>
          <button onClick={toggleDropdown} className='p-2 text-sm font-medium text-gray-400'>
            •••
          </button>
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-36 bg-gray-700 rounded shadow-lg'>
              <button onClick={handleEdit} className='block w-full px-4 py-2 text-sm hover:bg-gray-500'>
                Edit
              </button>
              <button onClick={onDelete} className='block w-full px-4 py-2 text-sm hover:bg-gray-500'>
                Remove
              </button>
            </div>
          )}
        </div>
      </footer>

      {/* Comment Content */}
      {isEditing ? (
        <div ref={editRef}>
          <textarea
            className='w-full p-2 mb-2 border rounded'
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className='flex gap-2'>
            <button onClick={handleEditSubmit} className='px-3 py-1 bg-blue-600 text-white rounded'>
              Save
            </button>
            <button onClick={handleEditCancel} className='px-3 py-1 bg-gray-400 text-white rounded'>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>{commentSnippet?.textOriginal}</p>
      )}

      {/* Reply and Replies */}
      <div className='flex mt-4 space-x-4'>
        <button onClick={handleReply} className='text-sm text-gray-500 hover:underline'>
          Reply
        </button>
        {replies?.length > 0 && (
          <button onClick={toggleReplies} className='text-sm text-gray-500 hover:underline'>
            {showReplies ? 'Hide Replies' : `View Replies (${replies.length})`}
          </button>
        )}
      </div>

      {isReplying && (
        <div className='mt-2'>
          <textarea
            className='w-full p-2 mb-2 border rounded'
            placeholder='Write your reply...'
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className='flex gap-2'>
            <button onClick={handleReplySubmit} className='px-3 py-1 bg-blue-600 text-white rounded'>
              Post
            </button>
            <button onClick={handleReplyCancel} className='px-3 py-1 bg-gray-600 text-white rounded'>
              Cancel
            </button>
          </div>
        </div>
      )}

      {showReplies &&
        replies?.map((reply, index) => (
          <SubCommentItem
            key={index}
            commentSnippet={reply.snippet}
            commentId={reply.id ?? ''}
            onReply={onReply}
            onDeleteReply={onDeleteReply}
            onUpDateReply={onUpDateReply}
          />
        ))}
    </article>
  )
}

export default CommentItem
