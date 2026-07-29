import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiTrendingUp, FiUsers, FiBriefcase, FiCheckCircle } from 'react-icons/fi'
import SearchBar from '../components/SearchBar/SearchBar'
import JobCard from '../components/JobCard/JobCard'
import LoadingSkeleton from '../components/LoadingSkeleton/LoadingSkeleton'
import { getJobs } from '../api/jobs'
import { categories } from '../mocks/jobs'

const stats = [
  { icon: <FiBriefcase />, label: 'Live job openings', value: '3,200+' },
  { icon: <FiUsers />, label: 'Hiring companies', value: '540+' },
  { icon: <FiCheckCircle />, label: 'Successful hires', value: '18,900+' },
  { icon: <FiTrendingUp />, label: 'New jobs this week', value: '210+' },
]

const categoryIcons = {
  Engineering: '💻', Design: '🎨', Data: '📊', Marketing: '📣', Content: '✍️', Sales: '🤝', Operations: '⚙️',
}

export default function HomePage() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs().then((jobs) => {
      setFeatured(jobs.slice(0, 6))
      setLoading(false)
    })
  }, [])

  const handleSearch = ({ role, location }) => {
    const params = new URLSearchParams()
    if (role) params.set('search', role)
    if (location) params.set('location', location)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-24 text-center">
          <span className="chip !bg-brand-50 dark:!bg-brand-950 !border-brand-100 dark:!border-brand-900 !text-brand-700 dark:!text-brand-300 mb-5">
            🚀 Over 3,000 new roles added this month
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Find the job that <span className="text-brand-600">moves you forward</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Search thousands of curated roles from startups to enterprises — or post an opening and meet your next great hire.
          </p>
          <div className="mt-8 max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Popular:</span>
            {['React Developer', 'Product Designer', 'Data Scientist', 'DevOps'].map((t) => (
              <button key={t} onClick={() => navigate(`/jobs?search=${encodeURIComponent(t)}`)} className="underline decoration-dotted hover:text-brand-600">
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 rounded-2xl shadow-card p-6 border border-slate-100 dark:border-slate-800">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mx-auto h-10 w-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-2">
                {s.icon}
              </div>
              <div className="font-extrabold text-lg text-slate-800 dark:text-slate-100">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Top categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(c)}`)}
              className="text-left rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <div className="text-2xl mb-2">{categoryIcons[c] || '💼'}</div>
              <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{c}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore roles</div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Featured jobs</h2>
          <button onClick={() => navigate('/jobs')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all →
          </button>
        </div>
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
