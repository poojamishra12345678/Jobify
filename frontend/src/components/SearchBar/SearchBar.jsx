import { useEffect, useRef, useState } from 'react'
import { FiSearch, FiMapPin } from 'react-icons/fi'
import { mockJobs } from '../../mocks/jobs'

export default function SearchBar({ onSearch, initialRole = '', initialLocation = '' }) {
  const [role, setRole] = useState(initialRole)
  const [location, setLocation] = useState(initialLocation)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef(null)

  const roleTitles = [...new Set(mockJobs.map((j) => j.role))]

  useEffect(() => {
    if (role.trim().length > 1) {
      setSuggestions(roleTitles.filter((r) => r.toLowerCase().includes(role.toLowerCase())).slice(0, 5))
    } else {
      setSuggestions([])
    }
  }, [role])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const submit = (e) => {
    e?.preventDefault()
    setShowSuggestions(false)
    onSearch?.({ role, location })
  }

  return (
    <form onSubmit={submit} ref={wrapperRef} className="relative w-full bg-white dark:bg-slate-900 rounded-2xl shadow-card p-2 flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1 flex items-center gap-2 px-3 py-2">
        <FiSearch className="text-slate-400 shrink-0" size={18} />
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          type="text"
          placeholder="Job title, keyword, or company"
          className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-card border border-slate-100 dark:border-slate-800 z-20 overflow-hidden">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => { setRole(s); setShowSuggestions(false) }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-slate-800"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden sm:block w-px bg-slate-100 dark:bg-slate-800 my-1" />
      <div className="flex items-center gap-2 px-3 py-2 sm:w-64">
        <FiMapPin className="text-slate-400 shrink-0" size={18} />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          type="text"
          placeholder="Location"
          className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>
      <button type="submit" className="btn btn-primary px-6 py-2.5 whitespace-nowrap">
        Search jobs
      </button>
    </form>
  )
}
