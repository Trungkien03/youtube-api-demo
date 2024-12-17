import React, { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import LoadingIndicator from '../common/components/LoadingIndicator'
import { initGapi, isUserSignedIn } from '../services/youtubeServices'

interface ProtectedRouteProps {
  children: ReactNode // Component con
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await initGapi()
        setIsAuthenticated(isUserSignedIn())
      } catch {
        console.log('====================================')
        console.log('Error')
        console.log('====================================')
      }
    }
    checkAuthentication()
  }, [])

  if (isAuthenticated === null) {
    return <LoadingIndicator />
  }

  return isAuthenticated ? <>{children}</> : <Navigate to='/login' replace />
}

export default ProtectedRoute
