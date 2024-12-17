interface ActivityItemProps {
  title: string
  description: string
  imageUrl: string
}

const ActivityItem = ({ title, description, imageUrl }: ActivityItemProps) => {
  return (
    <div
      className='flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 
      dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 
      w-full max-w-md md:max-w-lg lg:max-w-5xl'
    >
      {/* Image */}
      <div className='w-full md:w-1/3'>
        <img
          src={imageUrl}
          alt={title}
          className='object-cover w-full h-48 md:h-full rounded-t-lg md:rounded-none md:rounded-s-lg'
        />
      </div>

      {/* Content */}
      <div className='flex flex-col justify-between p-4 leading-normal w-full md:w-2/3'>
        <h5 className='text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate'>{title}</h5>
        <p
          className='text-sm font-normal text-gray-700 dark:text-gray-400 overflow-hidden'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2, // Giới hạn tối đa 2 dòng
            WebkitBoxOrient: 'vertical'
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

export default ActivityItem
