import { Helmet } from 'react-helmet-async'

import { Link } from 'react-router-dom'
import { CONFIG } from '../../utils/config-global'

// ----------------------------------------------------------------------

const PageNotFound = () => (
  <>
    {/* <Helmet>
      <title> {`404 page not found! | Error - ${CONFIG.appName}`}</title>
    </Helmet> */}
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='max-w-md w-full text-center p-6 bg-white rounded-lg shadow-lg'>
        {/* Header */}
        <h1 className='text-6xl font-bold text-blue-600 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Page Not Found</h2>
        <p className='text-gray-500 mb-6'>Oops! The page you are looking for does not exist or has been moved.</p>

        {/* Image */}
        <div className='flex justify-center mb-6'>
          <img
            src='/assets/images/not_found.png' // Đặt ảnh tại đường dẫn phù hợp
            alt='Not Found'
            className='w-40 h-40 object-cover'
          />
        </div>

        {/* Navigation Buttons */}
        <div className='flex flex-col gap-3'>
          <Link
            to='/'
            className='inline-block px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all'
          >
            Go to Homepage
          </Link>
          <Link
            to='/contact'
            className='inline-block px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-200 transition-all'
          >
            Report an Issue
          </Link>
        </div>
      </div>
    </div>
  </>
)

export default PageNotFound
