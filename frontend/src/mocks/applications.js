export const initialApplications = [
  { id: 'a1', jobId: 'm1', status: 'Interviewing', appliedAt: '2026-07-21' },
  { id: 'a2', jobId: 'm3', status: 'Applied', appliedAt: '2026-07-19' },
  { id: 'a3', jobId: 'm6', status: 'Offer', appliedAt: '2026-07-14' },
]

export const applicationStatuses = ['Applied', 'Interviewing', 'Offer', 'Rejected']

export const mockApplicantsByJob = {
  m1: [
    { id: 'c1', name: 'Ananya Sharma', email: 'ananya@example.com', stage: 'New', appliedAt: '2026-07-24' },
    { id: 'c2', name: 'Rohit Verma', email: 'rohit@example.com', stage: 'Shortlisted', appliedAt: '2026-07-22' },
    { id: 'c3', name: 'Priya Nair', email: 'priya@example.com', stage: 'Interview', appliedAt: '2026-07-20' },
    { id: 'c4', name: 'Karan Mehta', email: 'karan@example.com', stage: 'Hired', appliedAt: '2026-07-10' },
  ],
  m2: [
    { id: 'c5', name: 'Simran Kaur', email: 'simran@example.com', stage: 'New', appliedAt: '2026-07-23' },
    { id: 'c6', name: 'Aditya Rao', email: 'aditya@example.com', stage: 'Rejected', appliedAt: '2026-07-15' },
  ],
}
