import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const CommentManager: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const [comments, setComments] = useState<gapi.client.youtube.CommentThread[]>([])
  const [videoTitle, setVideoTitle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch Video Title
  const fetchVideoTitle = async () => {
    try {
      const response = await gapi.client.youtube.videos.list({
        part: 'snippet',
        id: videoId
      })

      const title = response.result.items?.[0]?.snippet?.title || 'Unknown Video Title'
      setVideoTitle(title)
    } catch (error) {
      console.error('Error fetching video title:', error)
      setVideoTitle('Error loading title')
    }
  }

  // Fetch Comments
  const fetchComments = async () => {
    try {
      const response = await gapi.client.youtube.commentThreads.list({
        part: 'snippet,replies',
        videoId: videoId,
        maxResults: 10
      })
      setComments(response.result.items || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (videoId) {
      fetchVideoTitle()
      fetchComments()
    }
  }, [videoId])

  return (
    <div className='p-4'>
      {/* Video Title */}
      <h2 className='text-2xl font-bold mb-4 text-center text-white'>{videoTitle}</h2>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>
        {/* Left Side - Video (40%) */}
        <div className='lg:col-span-2 flex justify-center'>
          <div className='w-full max-w-2xl aspect-w-16 aspect-h-9'>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
              title='YouTube Video'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='w-full h-[240px] md:h-[360px] lg:h-[400px] rounded-lg shadow-lg'
            ></iframe>
          </div>
        </div>

        {/* Right Side - Comments (60%) */}
        <div className='lg:col-span-3'>
          <h3 className='text-xl font-bold mb-4 text-white'>Comments</h3>
          {loading ? (
            <p className='text-gray-400 text-center'>Loading comments...</p>
          ) : comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className='p-4 bg-gray-900 rounded mb-2'>
                <p className='font-bold text-blue-400'>
                  {comment.snippet?.topLevelComment?.snippet?.authorDisplayName}
                </p>
                <p className='text-gray-300'>{comment.snippet?.topLevelComment?.snippet?.textOriginal}</p>
              </div>
            ))
          ) : (
            <p className='text-gray-400 text-center'>No comments found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentManager
