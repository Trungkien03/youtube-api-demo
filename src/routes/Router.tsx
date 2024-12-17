import { Navigate, useRoutes } from 'react-router-dom'
import CommentManager from '../features/Comment/CommentManager'
import Login from '../features/Login/Login'
import PageNotFound from '../features/NotFound/PageNotFound'
import ChannelActivities from '../features/Reports/ChannelActivities'
import MainLayout from '../layouts/MainLayout'
import appRoutes from './configs/appRoutes'

const Router = () => {
  return useRoutes([
    {
      path: appRoutes.ROOT,
      element: <Navigate to={appRoutes.LOGIN} replace />
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: appRoutes.LOGIN,
          element: <Login />
        },
        {
          path: appRoutes.REPORTS,
          element: <ChannelActivities />
        },
        {
          path: appRoutes.COMMENTS,
          element: <CommentManager />
        }
      ]
    },
    {
      path: appRoutes.NOT_FOUND,
      element: <PageNotFound />
    }
  ])
}

export default Router
