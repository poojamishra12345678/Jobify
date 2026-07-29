import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiX } from 'react-icons/fi'
import FilterSidebar from '../components/FilterSidebar/FilterSidebar'
import SearchBar from '../components/SearchBar/SearchBar'
import JobCard from '../components/JobCard/JobCard'
import Pagination from '../components/Pagination/Pagination'
import EmptyState from '../components/EmptyState/EmptyState'
import LoadingSkeleton from '../components/LoadingSkeleton/LoadingSkeleton'
import { getJobs } from '../api/jobs'
import { getSavedJobIds, saveJob, unsaveJob } from '../api/applications'
import { useToast } from '../context/ToastContext'

const PAGE_SIZE = 6

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { showToast } = useToast()

  const [allJobs, setAllJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [savedIds, setSavedIds] = useState([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    location: searchParams.get('location') || '',
    jobType: [],
    experience: [],
    category: searchParams.get('category') ? [searchParams.get('category')] : [],
    minSalary: 0,
    sortBy: 'newest',
  })

  useEffect(() => {
    setLoading(true)
    getJobs().then((jobs) => {
      setAllJobs(jobs)
      setLoading(false)
    })
    getSavedJobIds().then(setSavedIds)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const filteredJobs = useMemo(() => {
    let result = [...allJobs]
    const { search, location, jobType, experience, category, minSalary, sortBy } = filters

    if (search) {
      const q = search.toLowerCase()
      result = result.filter((j) => j.role.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q))
    }
    if (location) {
      const q = location.toLowerCase()
      result = result.filter((j) => j.location.toLowerCase().includes(q))
    }
    if (jobType.length) result = result.filter((j) => jobType.includes(j.jobType))
    if (experience.length) result = result.filter((j) => experience.includes(j.experience))
    if (category.length) result = result.filter((j) => category.includes(j.category))
    if (minSalary > 0) {
      result = result.filter((j) => {
        const num = parseInt(String(j.salaryPackage).replace(/[^\d]/g, ''), 10)
        return isNaN(num) || num >= minSalary
      })
    }
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
    if (sortBy === 'oldest') result.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt))

    return result
  }, [allJobs, filters])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE))
  const pageJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSearch = ({ role, location }) => {
    setFilters((f) => ({ ...f, search: role, location }))
    const params = new URLSearchParams()
    if (role) params.set('search', role)
    if (location) params.set('location', location)
    setSearchParams(params)
  }

  const resetFilters = () => {
    setFilters({ search: '', location: '', jobType: [], experience: [], category: [], minSalary: 0, sortBy: 'newest' })
    setSearchParams({})
  }

  const toggleSave = async (jobId) => {
    if (savedIds.includes(jobId)) {
      const next = await unsaveJob(jobId)
      setSavedIds(next)
      showToast('Removed from saved jobs', 'info')
    } else {
      const next = await saveJob(jobId)
      setSavedIds(next)
      showToast('Job saved', 'success')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Find your next role</h1>
        <SearchBar onSearch={handleSearch} initialRole={filters.search} initialLocation={filters.location} />
      </div>

      <div className="flex items-center justify-between mb-4 md:hidden">
        <button onClick={() => setMobileFiltersOpen(true)} className="btn btn-outline-primary text-sm inline-flex items-center gap-2 !px-4 !py-2">
          <FiFilter size={14} /> Filters
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">{filteredJobs.length} jobs</span>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <div className="hidden md:block">
          <FilterSidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />
        </div>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white dark:bg-slate-950 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}><FiX size={20} /></button>
              </div>
              <FilterSidebar filters={filters} setFilters={setFilters} onReset={resetFilters} />
              <button onClick={() => setMobileFiltersOpen(false)} className="btn btn-primary w-full mt-4">
                Show {filteredJobs.length} jobs
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="hidden md:flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">{filteredJobs.length} jobs found</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value }))}
              className="form-select !w-auto text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>

          {loading ? (
            <LoadingSkeleton count={6} />
          ) : pageJobs.length === 0 ? (
            <EmptyState
              title="No jobs found"
              message="Try adjusting your filters or search terms."
              icon="🔍"
              action={<button onClick={resetFilters} className="btn btn-primary !px-5 !py-2 text-sm">Clear filters</button>}
            />
          ) : (
            <div className="grid gap-4">
              {pageJobs.map((job) => (
                <JobCard key={job.id} job={job} variant="expanded" saved={savedIds.includes(job.id)} onToggleSave={toggleSave} />
              ))}
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
