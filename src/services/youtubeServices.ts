import { gapi } from 'gapi-script'
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, OAUTH_2, SCOPE_READ } from '../common/constants/appConstants'

export const initGapi = () => {
  return new Promise<void>((resolve, reject) => {
    gapi.load(OAUTH_2, () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOCS],
          scope: SCOPE_READ
        })
        .then(() => resolve())
        .catch((error) => reject(error))
    })
  })
}

export const isUserSignedIn = (): boolean => {
  const authInstance = gapi.auth2.getAuthInstance()
  return authInstance?.isSignedIn.get() || false // Kiểm tra trạng thái đăng nhập
}

export const getChannelActivities = async () => {
  try {
    const response = await gapi.client.youtube.activities.list({
      part: 'snippet,contentDetails',
      mine: true,
      maxResults: 10
    })
    return response.result.items
  } catch (error) {
    throw error
  }
}

export const getChannelSettings = async () => {
  try {
    const response = await gapi.client.youtube.channels.list({
      part: 'snippet,statistics,brandingSettings',
      mine: true
    })
    console.log(response.result.items)
    return response.result.items
  } catch (error) {
    throw error
  }
}
