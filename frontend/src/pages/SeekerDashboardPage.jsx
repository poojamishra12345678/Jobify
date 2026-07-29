import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUpload, FiFileText, FiBookmark } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getMyApplications } from '../api/applications'
import { getJobs } from '../api/jobs'
import ApplicationStatusBadge from '../components/ApplicationStatusBadge/ApplicationStatusBadge'
import EmptyState from '../components/EmptyState/EmptyState'
import JobCard from '../components/JobCard/JobCard'
import { getSavedJobIds } from '../api/applications'

const statusOrder = ['Applied', 'Interviewing', 'Offer', 'Rejected']

export default function SeekerDashboardPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [applications, setApplications] = useState([])
  const [jobsById, setJobsById] = useState({})
  const [savedJobs, setSavedJobs] = useState([])
  const [resumeName, setResumeName] = useState(localStorage.getItem('jobify_resume_name') || '')
  const [activeTab, setActiveTab] = useState('applications')

  useEffect(() => {
    Promise.all([getMyApplications(), getJobs(), getSavedJobIds()]).then(([apps, jobs, savedIds]) => {
      setApplications(apps)
      const map = {}
      jobs.forEach((j) => { map[j.id] = j })
      setJobsById(map)
      setSavedJobs(jobs.filter((j) => savedIds.includes(j.id)))
    })
  }, [])

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    localStorage.setItem('jobify_resume_name', file.name)
    setResumeName(file.name)
    showToast('Resume uploaded successfully', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Profile summary */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
        <div className="h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xl font-bold shrink-0">
          {(user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Job Seeker'}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          {user?.skills && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {String(user.skills).split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                <span key={s} className="chip">{s}</span>
              ))}
            </div>
          )}
        </div>
        <Link to="/profile" className="btn btn-outline-primary !px-4 !py-2 text-sm self-start">Edit profile</Link>
      </div>

      {/* Resume upload */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 mb-8">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3 inline-flex items-center gap-2"><FiFileText /> Resume</h2>
        <div className="flex items-center gap-4">
          <label className="btn btn-outline-primary !px-4 !py-2 text-sm inline-flex items-center gap-2 cursor-pointer">
            <FiUpload size={14} /> {resumeName ? 'Replace resume' : 'Upload resume'}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
          </label>
          {resumeName && <span className="text-sm text-slate-500 dark:text-slate-400">{resumeName}</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 mb-6">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-sm font-semibold border-b-2 ${activeTab === 'applications' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
        >
          Applied jobs ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-semibold border-b-2 inline-flex items-center gap-1 ${activeTab === 'saved' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
        >
          <FiBookmark size={14} /> Saved jobs ({savedJobs.length})
        </button>
      </div>

      {activeTab === 'applications' && (
        applications.length === 0 ? (
          <EmptyState title="No applications yet" message="Jobs you apply to will show up here with live status updates." icon="📄"
            action={<Link to="/jobs" className="btn btn-primary !px-5 !py-2 text-sm">Browse jobs</Link>} />
        ) : (
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="text-left font-medium px-5 py-3">Role</th>
                  <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">Company</th>
                  <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">Applied on</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const job = jobsById[app.jobId]
                  return (
                    <tr key={app.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-5 py-3">
                        {job ? <Link to={`/jobs/${job.id}`} className="font-medium text-slate-800 dark:text-slate-100 hover:text-brand-600">{job.role}</Link> : 'Job removed'}
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell text-slate-500 dark:text-slate-400">{job?.companyName || '—'}</td>
                      <td className="px-5 py-3 hidden sm:table-cell text-slate-500 dark:text-slate-400">{app.appliedAt}</td>
                      <td className="px-5 py-3"><ApplicationStatusBadge status={app.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      )}

      {activeTab === 'saved' && (
        savedJobs.length === 0 ? (
          <EmptyState title="No saved jobs" message="Bookmark jobs while browsing to find them here later." icon="🔖"
            action={<Link to="/jobs" className="btn btn-primary !px-5 !py-2 text-sm">Browse jobs</Link>} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {savedJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )
      )}
    </div>
  )
}
