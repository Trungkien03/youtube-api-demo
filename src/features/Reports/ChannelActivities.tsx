import React, { useCallback, useEffect, useRef, useState } from 'react'
import { initGapi } from '../../services/youtubeServices'
import ActivityItem from './components/ActivityItem'

const ChannelActivities: React.FC = () => {
  const [activities, setActivities] = useState<gapi.client.youtube.Activity[]>([])
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    initGapi()
      .then(() => fetchActivities())
      .catch((error) => console.error('Error initializing GAPI:', error))
  }, [])

  // Fetch Activities Function
  const fetchActivities = async (pageToken?: string) => {
    if (loading) return // Tránh gọi lại khi đang loading
    setLoading(true)

    try {
      const response = await gapi.client.youtube.activities.list({
        part: 'snippet,contentDetails',
        mine: true,
        maxResults: 10,
        pageToken: pageToken || undefined
      })

      const newActivities = response.result.items || []
      setActivities((prevActivities) => [...prevActivities, ...newActivities])
      setNextPageToken(response.result.nextPageToken || null)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  // Infinite Scroll Observer
  const lastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !nextPageToken) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchActivities(nextPageToken)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, nextPageToken]
  )

  return (
    <div className='p-4 text-white'>
      {/* Tiêu đề */}
      <h1 className='text-2xl font-bold mb-8 text-center'>YouTube Channel Activities</h1>

      {/* Container Item */}
      <div className='flex flex-col items-center gap-6'>
        {' '}
        {/* Căn giữa và tạo gap */}
        {activities.map((activity, index) => (
          <div
            ref={index === activities.length - 1 ? lastItemRef : null}
            key={index}
            className='w-full max-w-2xl' // Đặt max-width để các item không tràn ra
          >
            <ActivityItem
              title={activity.snippet?.title ?? ''}
              description={activity.snippet?.description ?? ''}
              imageUrl={activity.snippet?.thumbnails?.high?.url ?? ''}
            />
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && <p className='text-gray-400 text-center mt-4'>Loading...</p>}
    </div>
  )
}

export default ChannelActivities
