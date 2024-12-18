import { DialogType } from '@app/common/types/dialogSlice.type'
import { useAppDispatch } from '@app/stores'
import { hideDialog, showDialog } from '@app/stores/slices/dialog.slice'
import { useEffect, useRef, useState } from 'react'

const useCommentItemViewModel = ({
  commentSnippet,
  commentId,
  onDelete,
  onReply,
  replies
}: {
  commentSnippet: gapi.client.youtube.CommentSnippet | undefined
  commentId: string
  replies?: gapi.client.youtube.Comment[]
  onDelete?: () => void
  onReply?: (replyText: string, parentId: string) => void
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [commentText, setCommentText] = useState(commentSnippet?.textOriginal || '')
  const [replyText, setReplyText] = useState('')
  const [originalComment, setOriginalComment] = useState(commentSnippet?.textOriginal || '')

  const editRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  const handleEdit = () => {
    setIsEditing(true)
    setCommentText(commentSnippet?.textOriginal ?? '')
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
    if (replyText.trim() !== '' && onReply) {
      onReply(replyText, commentId)
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
        type: DialogType.ALERT,
        onConfirm() {
          if (onDelete) onDelete()
          dispatch(hideDialog())
        }
      })
    )
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

  return {
    isDropdownOpen,
    isEditing,
    isReplying,
    showReplies,
    commentText,
    replyText,
    editRef,
    toggleDropdown,
    handleEdit,
    handleEditSubmit,
    handleEditCancel,
    handleReply,
    handleReplyCancel,
    handleReplySubmit,
    toggleReplies,
    handleRemove,
    setCommentText,
    setReplyText,
    replies
  }
}

export default useCommentItemViewModel
