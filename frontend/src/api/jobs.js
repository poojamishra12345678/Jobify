import axiosClient from './axiosClient'
import { mockJobs } from '../mocks/jobs'

// The backend currently models a job posting as a "Company" document
// ({ companyName, salaryPackage, role, location }). We normalize that
// into a richer "Job" shape the UI works with, and pad in the extra
// fields (jobType, experience, description...) that the backend doesn't
// store yet. Swap this mapping out once the backend schema grows.
function normalizeBackendCompany(doc) {
  return {
    id: doc._id,
    companyName: doc.companyName,
    role: doc.role,
    location: doc.location,
    salaryPackage: doc.salaryPackage,
    jobType: doc.jobType || 'Full-time',
    experience: doc.experience || 'Not specified',
    remote: /remote/i.test(doc.location || ''),
    category: doc.category || 'Engineering',
    logo: doc.logo || '🏢',
    postedAt: doc.createdAt || new Date().toISOString(),
    description: doc.description || 'No description provided by the employer yet.',
    requirements: doc.requirements || [],
    companyInfo: doc.companyInfo || { about: `${doc.companyName} hasn't added a company description yet.`, size: 'N/A', founded: 'N/A', website: '' },
    appliedStudents: doc.appliedStudents || [],
    _source: 'backend',
  }
}

function normalizeMock(job) {
  return { ...job, _source: 'mock' }
}

let hasWarnedFallback = false
function warnFallback(context, error) {
  if (!hasWarnedFallback) {
    console.warn(`[jobify] Falling back to mock data (${context}). Backend said:`, error?.message || error)
    hasWarnedFallback = true
  }
}

export async function getJobs(filters = {}) {
  try {
    const { data } = await axiosClient.get('/company')
    const list = (data?.companies || []).map(normalizeBackendCompany)
    if (list.length === 0) throw new Error('empty backend list')
    return applyFilters(list, filters)
  } catch (error) {
    warnFallback('getJobs', error)
    return applyFilters(mockJobs.map(normalizeMock), filters)
  }
}

export async function getJobById(id) {
  // Mock IDs look like "m1"; anything else is assumed to be a Mongo ObjectId.
  if (String(id).startsWith('m')) {
    const found = mockJobs.find((j) => j.id === id)
    return found ? normalizeMock(found) : null
  }
  try {
    const { data } = await axiosClient.get(`/company/${id}`)
    return data?.company ? normalizeBackendCompany(data.company) : null
  } catch (error) {
    warnFallback('getJobById', error)
    const found = mockJobs.find((j) => j.id === id)
    return found ? normalizeMock(found) : null
  }
}

export async function getSimilarJobs(job, limit = 3) {
  const all = await getJobs()
  return all
    .filter((j) => j.id !== job.id && (j.category === job.category || j.companyName === job.companyName))
    .slice(0, limit)
}

export async function createJob(payload) {
  // Maps to POST /company on the backend (employer/admin only there today).
  const { data } = await axiosClient.post('/company', {
    companyName: payload.companyName,
    salaryPackage: payload.salaryPackage,
    role: payload.role,
    location: payload.location,
  })
  return data
}

export async function updateJob(id, payload) {
  const { data } = await axiosClient.put(`/company`, { id, ...payload })
  return data
}

export async function deleteJob(id) {
  const { data } = await axiosClient.delete(`/company`, { data: { id } })
  return data
}

function applyFilters(list, filters) {
  let result = [...list]
  const { search, location, jobType, experience, category, minSalary, sortBy } = filters

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (j) => j.role.toLowerCase().includes(q) || j.companyName.toLowerCase().includes(q)
    )
  }
  if (location) {
    const q = location.toLowerCase()
    result = result.filter((j) => j.location.toLowerCase().includes(q))
  }
  if (jobType?.length) {
    result = result.filter((j) => jobType.includes(j.jobType))
  }
  if (experience?.length) {
    result = result.filter((j) => experience.includes(j.experience))
  }
  if (category?.length) {
    result = result.filter((j) => category.includes(j.category))
  }
  if (sortBy === 'newest') {
    result.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
  } else if (sortBy === 'oldest') {
    result.sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt))
  }
  return result
}
