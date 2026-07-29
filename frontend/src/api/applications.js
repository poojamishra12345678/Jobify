import axiosClient from './axiosClient'
import { initialApplications, mockApplicantsByJob } from '../mocks/applications'

const STORAGE_KEY = 'jobify_applications'

function readLocalApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : initialApplications
  } catch {
    return initialApplications
  }
}

function writeLocalApplications(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

// Attempts the real backend endpoint first (POST /company/apply/:id), and
// always mirrors the application into local storage so the Job Seeker
// Dashboard's status tracker works even though the backend doesn't yet
// return/persist an application record.
export async function applyToJob(jobId) {
  try {
    await axiosClient.post(`/company/apply/${jobId}`)
  } catch (error) {
    console.warn('[jobify] backend apply endpoint unavailable, recording locally only:', error?.message)
  }
  const list = readLocalApplications()
  if (list.some((a) => a.jobId === jobId)) return list
  const next = [...list, { id: `a${Date.now()}`, jobId, status: 'Applied', appliedAt: new Date().toISOString().slice(0, 10) }]
  writeLocalApplications(next)
  return next
}

export async function getMyApplications() {
  return readLocalApplications()
}

export async function getApplicantsForJob(jobId) {
  return mockApplicantsByJob[jobId] || []
}

export async function saveJob(jobId) {
  const raw = localStorage.getItem('jobify_saved_jobs')
  const saved = raw ? JSON.parse(raw) : []
  if (!saved.includes(jobId)) saved.push(jobId)
  localStorage.setItem('jobify_saved_jobs', JSON.stringify(saved))
  return saved
}

export async function unsaveJob(jobId) {
  const raw = localStorage.getItem('jobify_saved_jobs')
  const saved = raw ? JSON.parse(raw) : []
  const next = saved.filter((id) => id !== jobId)
  localStorage.setItem('jobify_saved_jobs', JSON.stringify(next))
  return next
}

export async function getSavedJobIds() {
  const raw = localStorage.getItem('jobify_saved_jobs')
  return raw ? JSON.parse(raw) : []
}
