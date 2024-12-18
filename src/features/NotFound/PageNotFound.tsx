import { CONFIG } from '@app/utils/config-global'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

// ----------------------------------------------------------------------

const PageNotFound = () => (
  <>
    {/* Thêm Header */}
    <Helmet>
      <title>404 Page Not Found | {CONFIG.appName}</title>
      <meta name='description' content='The page you are looking for does not exist or has been moved.' />
    </Helmet>

    {/* UI */}
    <div className='flex items-center justify-center min-h-screen bg-gray-900'>
      <div className='max-w-md w-full text-center p-6 bg-white rounded-lg shadow-lg'>
        {/* Header */}
        <h1 className='text-6xl font-bold text-red-600 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Page Not Found</h2>
        <p className='text-gray-500 mb-6'>Oops! The page you are looking for does not exist or has been moved.</p>

        {/* Navigation Buttons */}
        <div className='flex flex-col gap-3'>
          <Link
            to='/'
            className='inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all'
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  </>
)

export default PageNotFound
