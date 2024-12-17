import React from 'react'
import useRouter from '../../../hooks/useRouter'
import useLoginViewModel from '../viewmodels/useLoginViewModel'
import appRoutes from '../../../routes/configs/appRoutes'
import { useAppDispatch } from '../../../stores'
import { setUser } from '../../../stores/slices/auth.slice'

const Login: React.FC = () => {
  const { login } = useLoginViewModel()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogin = async () => {
    try {
      const user = await login()
      console.log('User logged in:', user)
      dispatch(setUser(user))
      router.push(appRoutes.REPORTS)
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-900'>
      {/* Left Side: Login Form */}
      <div className='flex min-h-screen flex-1 items-center justify-center'>
        <div className='w-full max-w-md flex-1 bg-gray-800 p-8 rounded-lg shadow-lg'>
          {/* Header */}
          <div className='flex items-center justify-center space-x-4'>
            <h1 className='text-2xl font-bold text-white'>YouTube Reports</h1>
            <img src='https://www.svgrepo.com/show/475700/youtube-color.svg' alt='YouTube' className='w-10 h-10' />
          </div>

          {/* Divider */}
          <div className='flex items-center mb-6'>
            <hr className='flex-grow border-gray-600' />
            <span className='text-gray-400 mx-4'>or</span>
            <hr className='flex-grow border-gray-600' />
          </div>

          {/* Sign in with Google */}
          <button
            onClick={handleLogin}
            type='button'
            className='flex items-center justify-center w-full px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition'
          >
            <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google' className='w-5 h-5 mr-2' />
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Right Side: Portfolio */}
      {/* <div className='hidden lg:flex flex-1'>
        <iframe
          src='https://kane-dev.netlify.app'
          title='My Portfolio'
          className='w-full h-screen border-0 shadow-lg'
          allowFullScreen
        ></iframe>
      </div> */}
    </div>
  )
}

export default Login
