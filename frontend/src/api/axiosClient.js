
import axios from 'axios'

// Backend base URL
const BASE_URL = 'https://jobify-backend-4gsf.onrender.com'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach authentication token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobify_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle authentication errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('jobify:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export default axiosClient
export { BASE_URL }
