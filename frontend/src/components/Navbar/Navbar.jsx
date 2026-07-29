import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiBriefcase, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from '../common/ThemeToggle'

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400'}`

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  const dashboardPath = user?.isEmployer ? '/employer/dashboard' : '/dashboard'

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-slate-800 dark:text-slate-100">
          <span className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
            <FiBriefcase size={16} />
          </span>
          Jobify
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/jobs" className={linkClass}>Find Jobs</NavLink>
          {isAuthenticated && user?.isEmployer && (
            <NavLink to="/employer/dashboard" className={linkClass}>Employer Dashboard</NavLink>
          )}
          {isAuthenticated && !user?.isEmployer && (
            <NavLink to="/dashboard" className={linkClass}>My Dashboard</NavLink>
          )}
          {isAuthenticated && user?.isEmployer && (
            <NavLink to="/post-job" className={linkClass}>Post a Job</NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600">
                <span className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
                {user?.name?.split(' ')[0] || 'Account'}
              </Link>
              <button onClick={handleLogout} className="btn btn-outline-primary !px-3 !py-2 text-sm inline-flex items-center gap-1">
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-outline-primary !px-4 !py-2 text-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary !px-4 !py-2 text-sm">Sign up</Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-slate-600 dark:text-slate-300" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-3 bg-white dark:bg-slate-950">
          <NavLink to="/jobs" onClick={() => setOpen(false)} className={linkClass}>Find Jobs</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPath} onClick={() => setOpen(false)} className="block">{user?.isEmployer ? 'Employer Dashboard' : 'My Dashboard'}</NavLink>
              {user?.isEmployer && <NavLink to="/post-job" onClick={() => setOpen(false)} className="block">Post a Job</NavLink>}
              <NavLink to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-1"><FiUser size={14} /> Profile</NavLink>
              <button onClick={handleLogout} className="flex items-center gap-1 text-rose-600 text-sm font-medium"><FiLogOut size={14} /> Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn btn-outline-primary flex-1 text-center text-sm">Log in</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn btn-primary flex-1 text-center text-sm">Sign up</Link>
            </div>
          )}
          <div className="pt-2"><ThemeToggle /></div>
        </div>
      )}
    </header>
  )
}
