import { initGapi } from '@app/services/youtubeServices'
import { useAppDispatch, useAppSelector } from '@app/stores'
import { useEffect, useRef } from 'react'
import { getListActivities, getStats } from '../slices/actions'

const useActivitiesViewModel = () => {
  const dispatch = useAppDispatch()
  const { isLoadingGetActivities, nextPageToken } = useAppSelector((state) => state.channelActivity.activities)
  const lastItemRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    initGapi()
      .then(() => {
        fetchActivities()
        fetchStats()
      })
      .catch((error) => console.error('Error initializing GAPI:', error))
  }, [])

  // Fetch Activities Function
  const fetchActivities = (pageToken?: string) => {
    dispatch(getListActivities({ pageToken }))
  }

  const fetchStats = () => {
    dispatch(getStats())
  }

  // Scroll Logic: Chạm tới item cuối cùng mới load
  useEffect(() => {
    const handleScroll = () => {
      if (lastItemRef.current) {
        const rect = lastItemRef.current.getBoundingClientRect()
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight

        if (isVisible && nextPageToken && !isLoadingGetActivities) {
          fetchActivities(nextPageToken)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [nextPageToken, isLoadingGetActivities])

  return { lastItemRef }
}

export default useActivitiesViewModel
