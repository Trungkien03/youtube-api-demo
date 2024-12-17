import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { ReactNode } from 'react'
import { DialogSize, DialogType } from '../../common/types/dialogSlice.type'

interface DialogState {
  isVisible: boolean
  content: ReactNode | null
  type: DialogType
  title: string | null
  confirmButtonText?: string
  cancelButtonText?: string
  onConfirm?: () => void
  onCancel?: () => void
  isCustomizeButton: boolean
  size: DialogSize
}

const initialDialogState: DialogState = {
  isVisible: false,
  content: null,
  title: null,
  confirmButtonText: 'OK',
  type: DialogType.NORMAL,
  cancelButtonText: 'Close',
  onConfirm: undefined,
  onCancel: undefined,
  isCustomizeButton: false,
  size: 'medium'
}

const dialogSlice = createSlice({
  name: 'dialog',
  initialState: initialDialogState,
  reducers: {
    showDialog: (
      state,
      action: PayloadAction<{
        title: string
        content: ReactNode
        confirmButtonText?: string
        cancelButtonText?: string
        onConfirm?: () => void
        onCancel?: () => void
        isCustomizeButton?: boolean
        type?: DialogType
      }>
    ) => {
      state.isVisible = true
      state.title = action.payload.title
      state.content = action.payload.content
      state.confirmButtonText = action.payload.confirmButtonText || 'OK'
      state.cancelButtonText = action.payload.cancelButtonText || 'Close'
      state.onConfirm = action.payload.onConfirm
      state.onCancel = action.payload.onCancel
      state.isCustomizeButton = action.payload.isCustomizeButton || false
      state.type = action.payload.type || DialogType.NORMAL
    },
    hideDialog: (state) => {
      state.isVisible = false
      state.title = null
      state.content = null
      state.confirmButtonText = 'OK'
      state.cancelButtonText = 'Close'
      state.onConfirm = undefined
      state.onCancel = undefined
    }
  }
})

export const { showDialog, hideDialog } = dialogSlice.actions
export default dialogSlice.reducer
