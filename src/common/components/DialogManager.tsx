import React from 'react'
import { useAppDispatch, useAppSelector } from '../../stores'
import { hideDialog } from '../../stores/slices/dialog.slice'
import { DialogType } from '../types/dialogSlice.type'

const images = {
  check_fail: '/assets/images/check_fail.png',
  check_warning: '/assets/images/check_warning.png',
  check_info: '/assets/images/check_info.png',
  check_success: '/assets/images/check_success.png'
}

const DialogManager: React.FC = () => {
  const dispatch = useAppDispatch()
  const {
    isVisible,
    type,
    content,
    title,
    confirmButtonText = 'OK',
    cancelButtonText = 'Đóng',
    onConfirm,
    onCancel,
    isCustomizeButton,
    size = 'small'
  } = useAppSelector((state) => state.dialogState)

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    else dispatch(hideDialog())
  }

  const handleCancel = () => {
    if (onCancel) onCancel()
    else dispatch(hideDialog())
  }

  const getDialogStyles = () => {
    switch (type) {
      case DialogType.ERROR:
        return { color: 'text-red-600', image: images.check_fail }
      case DialogType.WARNING:
        return { color: 'text-yellow-600', image: images.check_warning }
      case DialogType.ALERT:
        return { color: 'text-blue-600', image: images.check_info }
      case DialogType.SUCCESS:
        return { color: 'text-green-600', image: images.check_success }
      case DialogType.NORMAL:
      default:
        return { color: 'text-gray-600', image: images.check_info }
    }
  }

  const { color, image } = getDialogStyles()

  const getDialogSize = () => {
    switch (size) {
      case 'large':
        return 'max-w-4xl'
      case 'small':
        return 'max-w-sm'
      case 'medium':
      default:
        return 'max-w-md'
    }
  }

  if (!isVisible) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className={`relative bg-white p-6 rounded-lg shadow-lg w-full ${getDialogSize()}`}>
        {/* Nút Close ở góc trên bên phải */}
        <button
          onClick={handleCancel}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition duration-300'
        >
          &#x2715; {/* Unicode dấu "X" */}
        </button>

        <div className='text-center mb-4'>
          <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
        </div>

        <div className='flex flex-col items-center space-y-4'>
          <img src={image} alt='Dialog Icon' className='w-24 h-24 md:w-28 md:h-28 object-cover rounded-md' />
          <p className='text-gray-700 text-center'>{content}</p>
        </div>

        {!isCustomizeButton && (
          <div className='flex justify-center mt-6 space-x-4'>
            {type !== DialogType.NORMAL && (
              <button
                onClick={handleCancel}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-200 transition-all'
              >
                {cancelButtonText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`px-6 py-2 rounded-md font-semibold text-white transition-all bg-blue-500 bg-opacity-90 hover:opacity-80`}
            >
              {confirmButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DialogManager
