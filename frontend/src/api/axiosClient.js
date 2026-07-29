import axios from 'axios'

// Single source of truth for the backend base URL.
// Point this at your real backend by editing VITE_API_BASE_URL in .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach the auth token (if present) to every outgoing request.
// The backend's verifyToken middleware expects: Authorization: Bearer <token>
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobify_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Central place to react to auth failures.
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
