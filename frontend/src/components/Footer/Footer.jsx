import { Link } from 'react-router-dom'
import { FiBriefcase, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-slate-800 dark:text-slate-100">
            <span className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <FiBriefcase size={16} />
            </span>
            Jobify
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-xs">
            Connecting job seekers with the teams building what's next.
          </p>
          <div className="flex gap-3 mt-4 text-slate-400">
            <a href="#" aria-label="Twitter" className="hover:text-brand-600"><FiTwitter size={18} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-brand-600"><FiLinkedin size={18} /></a>
            <a href="#" aria-label="GitHub" className="hover:text-brand-600"><FiGithub size={18} /></a>
          </div>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">For Job Seekers</h5>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/jobs" className="hover:text-brand-600">Browse jobs</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-600">My applications</Link></li>
            <li><Link to="/register" className="hover:text-brand-600">Create account</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">For Employers</h5>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link to="/post-job" className="hover:text-brand-600">Post a job</Link></li>
            <li><Link to="/employer/dashboard" className="hover:text-brand-600">Manage applicants</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Jobify. Built for demo purposes.
      </div>
    </footer>
  )
}
