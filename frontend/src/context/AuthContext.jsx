import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loginUser, registerUser, logoutUser } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('jobify_user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null)
      logoutUser()
    }
    window.addEventListener('jobify:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('jobify:unauthorized', handleUnauthorized)
  }, [])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const { token, user: loggedInUser } = await loginUser(credentials)
      // Backend doesn't send a role-per-session distinction beyond the
      // student.role field ("student" | "admin"). We treat "admin" as an
      // Employer for the purposes of the UI's role-based redirect.
      const normalized = { ...loggedInUser, isEmployer: loggedInUser.role === 'admin' }
      localStorage.setItem('jobify_token', token)
      localStorage.setItem('jobify_user', JSON.stringify(normalized))
      setUser(normalized)
      return normalized
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      return await registerUser(payload)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
