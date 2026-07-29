import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

import HomePage from './pages/HomePage'
import JobListingsPage from './pages/JobListingsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SeekerDashboardPage from './pages/SeekerDashboardPage'
import EmployerDashboardPage from './pages/EmployerDashboardPage'
import PostJobPage from './pages/PostJobPage'
import CompanyProfilePage from './pages/CompanyProfilePage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs" element={<JobListingsPage />} />
                <Route path="/jobs/:id" element={<JobDetailsPage />} />
                <Route path="/company/:name" element={<CompanyProfilePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/dashboard" element={
                  <ProtectedRoute><SeekerDashboardPage /></ProtectedRoute>
                } />
                <Route path="/employer/dashboard" element={
                  <ProtectedRoute requireEmployer><EmployerDashboardPage /></ProtectedRoute>
                } />
                <Route path="/post-job" element={
                  <ProtectedRoute requireEmployer><PostJobPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>
                } />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
