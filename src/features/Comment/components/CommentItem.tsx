import { DialogType } from '@app/common/types/dialogSlice.type'
import { useAppDispatch } from '@app/stores'
import { hideDialog, showDialog } from '@app/stores/slices/dialog.slice'
import { fDate } from '@app/utils/format-time'
import { useEffect, useRef, useState } from 'react'

type CommentItemProps = {
  commentSnippet: gapi.client.youtube.CommentSnippet | undefined
  replies?: gapi.client.youtube.Comment[]
  onDelete?: () => void
  onReply?: (replyText: string) => void
  onDeleteReply?: (replyId: string) => void
}

const CommentItem = ({ commentSnippet, replies, onDelete, onReply, onDeleteReply }: CommentItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [commentText, setCommentText] = useState(commentSnippet?.textOriginal || '')
  const [replyText, setReplyText] = useState('')
  const [originalComment, setOriginalComment] = useState(commentSnippet?.textOriginal || '')

  const dispatch = useAppDispatch()

  const editRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  const handleEdit = () => {
    setIsEditing(true)
    setIsDropdownOpen(false)
  }

  const handleEditSubmit = () => {
    setIsEditing(false)
    setOriginalComment(commentText)
    console.log('Edited Comment:', commentText)
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setCommentText(originalComment)
  }

  const handleReply = () => setIsReplying(true)

  const handleReplyCancel = () => {
    setIsReplying(false)
    setReplyText('')
  }

  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText)
      setReplyText('')
      setIsReplying(false)
    }
  }

  const toggleReplies = () => setShowReplies((prev) => !prev)

  const handleRemove = () => {
    setIsDropdownOpen(false)

    dispatch(
      showDialog({
        title: 'Delete Comment',
        content: 'Are you sure you want to delete this comment?',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
        type: DialogType.ALERT
      })
    )

    // Handle delete confirm outside Redux
    const confirmDelete = () => {
      if (onDelete) onDelete()
      dispatch(hideDialog())
    }

    document.addEventListener('confirmDialog', confirmDelete, { once: true })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editRef.current && !editRef.current.contains(event.target as Node)) {
        if (isEditing) handleEditCancel()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEditing])

  return (
    <article className='p-6 text-base bg-white rounded-lg dark:bg-gray-800 mb-2'>
      {/* Comment Header */}
      <footer className='flex justify-between items-center mb-2'>
        <div className='flex items-center'>
          <p className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold'>
            <img
              className='mr-2 w-6 h-6 rounded-full'
              src={
                commentSnippet?.authorProfileImageUrl || 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
              }
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
          <button
            onClick={toggleDropdown}
            className='inline-flex items-center p-2 text-sm font-medium text-gray-400 dark:text-gray-400'
          >
            <svg className='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 3' fill='currentColor'>
              <path d='M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z' />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-36 bg-gray-700 rounded shadow-lg'>
              <button onClick={handleEdit} className='block w-full px-4 py-2 text-sm hover:bg-gray-500'>
                Edit
              </button>
              <button onClick={handleRemove} className='block w-full px-4 py-2 text-sm hover:bg-gray-500'>
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
        <p className='text-gray-200'>{commentSnippet?.textOriginal}</p>
      )}

      {/* Reply Button */}
      <div className='flex items-center mt-4 space-x-4'>
        <button onClick={handleReply} className='text-sm text-gray-500 hover:underline'>
          Reply
        </button>
        {replies && replies.length > 0 && (
          <button onClick={toggleReplies} className='text-sm text-gray-500 hover:underline'>
            {showReplies ? 'Hide Replies' : `View Replies (${replies.length})`}
          </button>
        )}
      </div>

      {/* Reply Form */}
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
              Post Reply
            </button>
            <button onClick={handleReplyCancel} className='px-3 py-1 bg-gray-400 text-white rounded'>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Replies List */}
      {showReplies && replies && replies.length > 0 && (
        <div className='ml-8'>
          {replies.map((reply, index) => (
            <CommentItem key={index} commentSnippet={reply.snippet} onDelete={() => onDeleteReply?.(reply.id || '')} />
          ))}
        </div>
      )}

      {/* Divider */}
      <hr className='mt-4 border-gray-600' />
    </article>
  )
}

export default CommentItem
