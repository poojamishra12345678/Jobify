import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiBookmark, FiDollarSign } from 'react-icons/fi'

export default function JobCard({ job, variant = 'compact', saved = false, onToggleSave }) {
  const isExpanded = variant === 'expanded'

  return (
    <div className={`group rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-soft hover:shadow-card transition-shadow p-5 ${isExpanded ? 'md:p-6' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-2xl shrink-0">
          {job.logo || '🏢'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link to={`/jobs/${job.id}`} className="font-semibold text-slate-800 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 line-clamp-2">
                {job.role}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">{job.companyName}</p>
            </div>
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(job.id)}
                aria-label="Save job"
                className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center border ${saved ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950 dark:border-brand-800' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-600'}`}
              >
                <FiBookmark fill={saved ? 'currentColor' : 'none'} size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1"><FiMapPin size={13} />{job.location}</span>
            <span className="inline-flex items-center gap-1"><FiDollarSign size={13} />{job.salaryPackage}</span>
            <span className="inline-flex items-center gap-1"><FiClock size={13} />{job.experience}</span>
          </div>

          {isExpanded && job.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-3">{job.description}</p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="chip">{job.jobType}</span>
            <span className="chip">{job.category}</span>
            {job.remote && <span className="chip !text-accent-600 !border-accent-200 dark:!border-accent-800">Remote</span>}
          </div>

          {isExpanded && (
            <Link
              to={`/jobs/${job.id}`}
              className="inline-block mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View details →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
