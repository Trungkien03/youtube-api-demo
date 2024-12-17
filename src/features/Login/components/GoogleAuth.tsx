import { gapi } from 'gapi-script'
import { useEffect, useState } from 'react'
import { CLIENT_ID } from '../../../common/constants/appConstants'

const GoogleAuth = () => {
  const [authInstance, setAuthInstance] = useState<gapi.auth2.GoogleAuth | null>(null)

  // Initialize GAPI
  useEffect(() => {
    const initGapi = () => {
      gapi.load('client:auth2', () => {
        gapi.client
          .init({
            clientId: CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/youtube.force-ssl'
          })
          .then(() => {
            console.log('GAPI Initialized')
            setAuthInstance(gapi.auth2.getAuthInstance())
          })
          .catch((error) => console.error('GAPI Initialization Error:', error))
      })
    }
    initGapi()
  }, [])

  // Login Function
  const handleLogin = async () => {
    try {
      if (!authInstance) throw new Error('Auth instance not ready.')
      const res = await authInstance.signIn()
      const user = res.getBasicProfile()
      console.log('User logged in:', {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        image: user.getImageUrl()
      })
    } catch (error) {
      console.error('Login Error:', error)
    }
  }

  // Logout Function
  const handleLogout = async () => {
    try {
      if (!authInstance) throw new Error('Auth instance not ready.')
      await authInstance.signOut()
      console.log('User logged out')
    } catch (error) {
      console.error('Logout Error:', error)
    }
  }

  return (
    <div className='flex flex-col items-center space-y-4'>
      <button onClick={handleLogin} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
        Login with Google
      </button>
      <button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'>
        Logout
      </button>
    </div>
  )
}

export default GoogleAuth
