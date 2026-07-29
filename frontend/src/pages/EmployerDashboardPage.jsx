import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiUsers, FiMapPin } from 'react-icons/fi'
import { getJobs } from '../api/jobs'
import { getApplicantsForJob } from '../api/applications'
import EmptyState from '../components/EmptyState/EmptyState'
import ApplicationStatusBadge from '../components/ApplicationStatusBadge/ApplicationStatusBadge'

const stages = ['New', 'Shortlisted', 'Interview', 'Hired', 'Rejected']

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs().then((data) => {
      setJobs(data)
      setLoading(false)
      if (data.length) setSelectedJob(data[0])
    })
  }, [])

  useEffect(() => {
    if (selectedJob) getApplicantsForJob(selectedJob.id).then(setApplicants)
  }, [selectedJob])

  const moveApplicant = (applicantId, newStage) => {
    setApplicants((prev) => prev.map((a) => (a.id === applicantId ? { ...a, stage: newStage } : a)))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Employer Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your postings and track applicants</p>
        </div>
        <Link to="/post-job" className="btn btn-primary !px-4 !py-2.5 text-sm inline-flex items-center gap-2">
          <FiPlus size={16} /> Post a job
        </Link>
      </div>

      {loading ? (
        <div className="skeleton h-40 w-full rounded-2xl" />
      ) : jobs.length === 0 ? (
        <EmptyState title="No jobs posted yet" message="Post your first opening to start receiving applicants." icon="📋"
          action={<Link to="/post-job" className="btn btn-primary !px-5 !py-2 text-sm">Post a job</Link>} />
      ) : (
        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Your postings ({jobs.length})</h3>
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${selectedJob?.id === job.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-950' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-200'}`}
              >
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">{job.role}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 inline-flex items-center gap-1"><FiMapPin size={12} /> {job.location}</div>
                <div className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1"><FiUsers size={12} /> {(mockApplicantCount(job.id))} applicants</div>
              </button>
            ))}
          </div>

          <div>
            {selectedJob && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">Pipeline — {selectedJob.role}</h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{applicants.length} applicants</span>
                </div>
                {applicants.length === 0 ? (
                  <EmptyState title="No applicants yet" message="Once candidates apply, they'll show up here." icon="🧑‍💻" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {stages.map((stage) => (
                      <div key={stage} className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 min-h-[200px]">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stage}</span>
                          <span className="text-xs text-slate-400">{applicants.filter((a) => a.stage === stage).length}</span>
                        </div>
                        <div className="space-y-2">
                          {applicants.filter((a) => a.stage === stage).map((a) => (
                            <div key={a.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-100 dark:border-slate-700 shadow-soft">
                              <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{a.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{a.email}</div>
                              <select
                                value={a.stage}
                                onChange={(e) => moveApplicant(a.id, e.target.value)}
                                className="form-select !text-xs !py-1 mt-2"
                              >
                                {stages.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function mockApplicantCount(jobId) {
  // Deterministic small pseudo-count for postings without seeded applicant data.
  const seed = String(jobId).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return (seed % 12) + 1
}
