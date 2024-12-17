import type { Middleware } from '@reduxjs/toolkit'
import { isRejectedWithValue } from '@reduxjs/toolkit'
import { DialogType } from '../../common/types/dialogSlice.type'
import { showDialog } from '../slices/dialog.slice'

const apiMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action)) {
      dispatch(
        showDialog({
          title: 'Error',
          content: 'Something went wrong',
          type: DialogType.ERROR
        })
      )
    }

    return next(action)
  }

export default apiMiddleware
