import React from 'react'
import ActivityItem from './components/ActivityItem'
import { useAppSelector } from '../../stores'
import ChannelStats from './components/ChannelStats'
import useActivitiesViewModel from './viewmodels/useActivitiesViewModel'

const ChannelActivities: React.FC = () => {
  const { isLoadingGetActivities, items: activities } = useAppSelector((state) => state.channelActivity.activities)
  const { lastItemRef } = useActivitiesViewModel()
  return (
    <div className='p-4 text-white space-y-8'>
      {/* Tiêu đề */}
      <h1 className='text-2xl font-bold mb-8 text-center'>Channel Reports</h1>

      <ChannelStats />

      <h1 className='text-2xl font-bold mb-8 text-center'>Channel Activities</h1>

      {/* Container Item */}
      <div className='flex flex-col items-center gap-6'>
        {activities.map((activity, index) => (
          <div ref={index === activities.length - 1 ? lastItemRef : null} key={index} className='w-full max-w-2xl'>
            <ActivityItem
              title={activity.snippet?.title ?? ''}
              description={activity.snippet?.description ?? ''}
              imageUrl={activity.snippet?.thumbnails?.high?.url ?? ''}
              videoId={activity.contentDetails?.upload?.videoId ?? ''}
            />
          </div>
        ))}
      </div>

      {/* Loading */}
      {isLoadingGetActivities && <p className='text-gray-400 text-center mt-4'>Loading...</p>}
    </div>
  )
}

export default ChannelActivities
