import { gapi } from 'gapi-script'
import { useEffect } from 'react'
import useRouter from '../../../hooks/useRouter'
import { initGapi } from '../../../services/youtubeServices'
import { useAppDispatch } from '../../../stores'
import { setUser } from '../../../stores/slices/auth.slice'

const useLoginViewModel = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const initializeGapi = async () => {
      await initGapi()
        .then(() => console.log('GAPI Initialized'))
        .catch((error) => console.error('Error initializing GAPI:', error))

      const authInstance = gapi.auth2.getAuthInstance()

      // Kiểm tra nếu người dùng đã đăng nhập
      if (authInstance?.isSignedIn.get()) {
        console.log('====================================')
        console.log(authInstance.currentUser.get())
        console.log('====================================')
        const user = authInstance.currentUser.get().getBasicProfile()

        // Cập nhật thông tin người dùng vào state
        dispatch(
          setUser({
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            image: user.getImageUrl()
          })
        )

        // Điều hướng sang trang "Reports"
        router.push('/reports')
      }
    }

    initializeGapi()
  }, [])

  const login = async () => {
    try {
      const instance = gapi.auth2.getAuthInstance()
      const res = await instance.signIn()
      const user = res.getBasicProfile()

      const userInfo = {
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        image: user.getImageUrl()
      }

      router.push('/reports')

      return userInfo
    } catch (error) {
      console.error('Login Error:', error)
      return null
    }
  }

  return { login }
}

export default useLoginViewModel
