import { useAppSelector } from '../../../stores'

const ChannelStats = () => {
  const { items: stats } = useAppSelector((state) => state.channelActivity.stats)

  return (
    <section className='bg-white dark:bg-gray-900'>
      <div className='max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6'>
        <dl className='grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white'>
          <div className='flex flex-col items-center justify-center'>
            <dt className='mb-2 text-3xl md:text-4xl font-extrabold'>
              {stats[0] ? stats[0].statistics?.videoCount : 0}
            </dt>
            <dd className='font-light text-gray-500 dark:text-gray-400'>Total Videos</dd>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <dt className='mb-2 text-3xl md:text-4xl font-extrabold'>
              {stats[0] ? stats[0].statistics?.subscriberCount : 0}
            </dt>
            <dd className='font-light text-gray-500 dark:text-gray-400'>Total Subscribers</dd>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <dt className='mb-2 text-3xl md:text-4xl font-extrabold'>
              {stats[0] ? stats[0].statistics?.viewCount : 0}
            </dt>
            <dd className='font-light text-gray-500 dark:text-gray-400'>Total Views</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

export default ChannelStats
