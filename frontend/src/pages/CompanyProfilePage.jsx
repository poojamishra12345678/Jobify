import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FiUsers, FiCalendar, FiGlobe, FiMapPin } from 'react-icons/fi'
import { getJobs } from '../api/jobs'
import JobCard from '../components/JobCard/JobCard'
import EmptyState from '../components/EmptyState/EmptyState'

export default function CompanyProfilePage() {
  const { name } = useParams()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJobs().then((all) => {
      setJobs(all.filter((j) => j.companyName.toLowerCase() === decodeURIComponent(name).toLowerCase()))
      setLoading(false)
    })
  }, [name])

  const company = jobs[0]

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12"><div className="skeleton h-40 w-full rounded-2xl" /></div>

  if (!company) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <EmptyState title="Company not found" message="We couldn't find a profile for this company." icon="🏢" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-3xl shrink-0">
            {company.logo}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{company.companyName}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 inline-flex items-center gap-1 mt-1"><FiMapPin size={14} /> {company.location}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-5 leading-relaxed">{company.companyInfo?.about}</p>
        <div className="flex flex-wrap gap-6 mt-5 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2"><FiUsers size={14} /> {company.companyInfo?.size} employees</span>
          <span className="inline-flex items-center gap-2"><FiCalendar size={14} /> Founded {company.companyInfo?.founded}</span>
          {company.companyInfo?.website && (
            <a href={company.companyInfo.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-brand-600 hover:underline">
              <FiGlobe size={14} /> Website
            </a>
          )}
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Open roles at {company.companyName} ({jobs.length})</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {jobs.map((j) => <JobCard key={j.id} job={j} />)}
      </div>
    </div>
  )
}
