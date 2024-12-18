import { Navigate, useRoutes } from 'react-router-dom'
import CommentManager from '../features/Comment/CommentManager'
import Login from '../features/Login/views/Login'
import PageNotFound from '../features/NotFound/PageNotFound'
import ChannelActivities from '../features/Reports/ChannelActivities'
import MainLayout from '../layouts/MainLayout'
import appRoutes from './configs/appRoutes'
import ProtectedRoute from './ProtectedRoute'

const Router = () => {
  return useRoutes([
    {
      path: appRoutes.ROOT,
      element: <Navigate to={appRoutes.LOGIN} replace />
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: appRoutes.REPORTS,
          element: <ChannelActivities />
        },
        {
          path: `${appRoutes.COMMENTS}/:videoId`,
          element: <CommentManager />
        }
      ]
    },
    {
      path: appRoutes.LOGIN,
      element: <Login />
    },
    {
      path: appRoutes.NOT_FOUND,
      element: <PageNotFound />
    }
  ])
}

export default Router
