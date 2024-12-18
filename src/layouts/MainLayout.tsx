import { gapi } from 'gapi-script'
import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import useRouter from '../hooks/useRouter'
import appRoutes from '../routes/configs/appRoutes'

const MainLayout: React.FC = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State để kiểm soát menu dropdown

  const user = gapi.auth2.getAuthInstance()?.currentUser?.get()?.getBasicProfile()

  const handleLogout = async () => {
    try {
      const authInstance = gapi.auth2.getAuthInstance()
      await authInstance.signOut()
      console.log('User logged out')
      router.push(appRoutes.LOGIN)
    } catch (error) {
      console.error('Logout Error:', error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <div className='min-h-screen bg-gray-800 text-white'>
      {/* Navbar */}
      <nav className='bg-gray-900 border-gray-200'>
        <div className='max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-5'>
          {/* Logo */}
          <Link to='/reports' className='flex items-center space-x-3 rtl:space-x-reverse'>
            <img
              loading='lazy'
              src='https://www.svgrepo.com/show/475700/youtube-color.svg'
              className='h-10'
              alt='Flowbite Logo'
            />
            <span className='self-center text-xl font-semibold whitespace-nowrap'>Youtube Reports</span>
          </Link>

          {/* User Avatar & Dropdown */}
          <div className='relative'>
            <div className=' flex items-center gap-2'>
              <span className='text-sm font-bold'>{user.getGivenName()}</span>
              <button
                type='button'
                onClick={toggleMenu} // Sự kiện click để mở menu
                className='flex items-center text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300'
              >
                <img className='w-8 h-8 rounded-full' src={user.getImageUrl()} alt='user photo' />
              </button>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className='absolute right-0 mt-2 z-50 bg-gray-700 divide-y divide-gray-600 rounded-lg shadow-lg w-48'>
                <div className='px-4 py-3'>
                  <span className='block text-sm'>{user.getGivenName()}</span>
                  <span className='block text-sm text-gray-400 truncate'>{user.getEmail()}</span>
                </div>
                <ul className='py-2'>
                  <li>
                    <button
                      onClick={handleLogout}
                      className='block w-full px-4 py-2 text-sm text-gray-300 text-left hover:bg-gray-600 hover:text-white'
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='p-4'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
