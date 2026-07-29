import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiMapPin, FiDollarSign, FiClock, FiBriefcase, FiGlobe, FiUsers, FiCalendar, FiCheckCircle } from 'react-icons/fi'
import { getJobById, getSimilarJobs } from '../api/jobs'
import { applyToJob, getMyApplications } from '../api/applications'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Modal from '../components/Modal/Modal'
import JobCard from '../components/JobCard/JobCard'
import EmptyState from '../components/EmptyState/EmptyState'

export default function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const [job, setJob] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applying, setApplying] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  useEffect(() => {
    setLoading(true)
    getJobById(id).then(async (data) => {
      setJob(data)
      setLoading(false)
      if (data) {
        getSimilarJobs(data).then(setSimilar)
      }
    })
    getMyApplications().then((apps) => setAlreadyApplied(apps.some((a) => a.jobId === id)))
  }, [id])

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } })
      return
    }
    setShowApplyModal(true)
  }

  const confirmApply = async () => {
    setApplying(true)
    try {
      await applyToJob(id)
      setAlreadyApplied(true)
      showToast('Application submitted successfully!', 'success')
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setApplying(false)
      setShowApplyModal(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="skeleton h-8 w-2/3 mb-4" />
        <div className="skeleton h-4 w-1/3 mb-8" />
        <div className="skeleton h-40 w-full mb-4" />
        <div className="skeleton h-40 w-full" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <EmptyState
          title="Job not found"
          message="This posting may have been removed or the link is incorrect."
          icon="🕵️"
          action={<Link to="/jobs" className="btn btn-primary !px-5 !py-2 text-sm">Browse jobs</Link>}
        />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-3xl shrink-0">
              {job.logo}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-slate-100">{job.role}</h1>
              <Link to={`/company/${encodeURIComponent(job.companyName)}`} className="text-brand-600 hover:text-brand-700 font-medium text-sm">
                {job.companyName}
              </Link>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1"><FiMapPin size={14} />{job.location}</span>
                <span className="inline-flex items-center gap-1"><FiDollarSign size={14} />{job.salaryPackage}</span>
                <span className="inline-flex items-center gap-1"><FiClock size={14} />{job.experience}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleApplyClick}
            disabled={alreadyApplied}
            className={`btn !px-6 !py-2.5 text-sm shrink-0 ${alreadyApplied ? '!bg-accent-50 !text-accent-700 dark:!bg-accent-900/30 dark:!text-accent-300' : 'btn-primary'}`}
          >
            {alreadyApplied ? (
              <span className="inline-flex items-center gap-2"><FiCheckCircle /> Applied</span>
            ) : 'Apply now'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          <span className="chip">{job.jobType}</span>
          <span className="chip">{job.category}</span>
          {job.remote && <span className="chip !text-accent-600 !border-accent-200 dark:!border-accent-800">Remote friendly</span>}
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-2">About this role</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{job.description}</p>

            {job.requirements?.length > 0 && (
              <>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2">What you'll need</h3>
                <ul className="space-y-1.5">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <FiCheckCircle className="text-accent-500 mt-0.5 shrink-0" size={14} />
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-5 h-fit">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">About {job.companyName}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">{job.companyInfo?.about}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2"><FiUsers size={14} /> {job.companyInfo?.size} employees</div>
              <div className="flex items-center gap-2"><FiCalendar size={14} /> Founded {job.companyInfo?.founded}</div>
              {job.companyInfo?.website && (
                <div className="flex items-center gap-2"><FiGlobe size={14} /> <a href={job.companyInfo.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline truncate">{job.companyInfo.website}</a></div>
              )}
            </div>
            <Link to={`/company/${encodeURIComponent(job.companyName)}`} className="inline-block mt-4 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View company profile →
            </Link>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 inline-flex items-center gap-2">
            <FiBriefcase /> Similar jobs
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </div>
      )}

      <Modal
        show={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Confirm your application"
        footer={
          <div className="flex gap-2 w-full">
            <button onClick={() => setShowApplyModal(false)} className="btn btn-outline-primary flex-1 !py-2">Cancel</button>
            <button onClick={confirmApply} disabled={applying} className="btn btn-primary flex-1 !py-2">
              {applying ? 'Submitting…' : 'Confirm & apply'}
            </button>
          </div>
        }
      >
        <p className="text-sm">
          You're about to apply for <strong>{job.role}</strong> at <strong>{job.companyName}</strong>. Your profile details will be shared with the employer.
        </p>
      </Modal>
    </div>
  )
}
