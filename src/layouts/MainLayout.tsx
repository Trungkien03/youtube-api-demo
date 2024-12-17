import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const MainLayout: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* Navbar */}
      <nav className='bg-gray-900 border-gray-200'>
        <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-3 rtl:space-x-reverse'>
            <img src='https://flowbite.com/docs/images/logo.svg' className='h-8' alt='Flowbite Logo' />
            <span className='self-center text-2xl font-semibold whitespace-nowrap'>Flowbite</span>
          </Link>

          {/* User Dropdown */}
          <div className='flex items-center md:order-2 space-x-3 rtl:space-x-reverse'>
            <div className='relative group'>
              {/* Avatar Button */}
              <button type='button' className='flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300'>
                <span className='sr-only'>Open user menu</span>
                <img
                  className='w-8 h-8 rounded-full'
                  src='https://flowbite.com/docs/images/people/profile-picture-3.jpg'
                  alt='user photo'
                />
              </button>

              {/* Dropdown Menu */}
              <div className='absolute right-0 mt-2 hidden group-hover:block z-50 bg-gray-700 divide-y divide-gray-600 rounded-lg shadow-lg w-48'>
                <div className='px-4 py-3'>
                  <span className='block text-sm'>Bonnie Green</span>
                  <span className='block text-sm text-gray-400 truncate'>name@flowbite.com</span>
                </div>
                <ul className='py-2'>
                  <li>
                    <Link
                      to='/dashboard'
                      className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white'
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/settings'
                      className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white'
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/earnings'
                      className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white'
                    >
                      Earnings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to='/logout'
                      className='block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white'
                    >
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className='items-center justify-between hidden w-full md:flex md:w-auto md:order-1' id='navbar-user'>
            <ul className='flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-800 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-gray-900'>
              <li>
                <Link to='/' className='block py-2 px-3 text-blue-500 rounded md:p-0'>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/about' className='block py-2 px-3 text-gray-300 hover:text-blue-500 md:p-0'>
                  About
                </Link>
              </li>
              <li>
                <Link to='/services' className='block py-2 px-3 text-gray-300 hover:text-blue-500 md:p-0'>
                  Services
                </Link>
              </li>
              <li>
                <Link to='/pricing' className='block py-2 px-3 text-gray-300 hover:text-blue-500 md:p-0'>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to='/contact' className='block py-2 px-3 text-gray-300 hover:text-blue-500 md:p-0'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='p-4'>
        <Outlet /> {/* Render các component con */}
      </main>
    </div>
  )
}

export default MainLayout
