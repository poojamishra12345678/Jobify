const styles = {
  Applied: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
  Interviewing: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Offer: 'bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  Rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  New: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Shortlisted: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
  Interview: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  Hired: 'bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
}

export default function ApplicationStatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.New}`}>
      {status}
    </span>
  )
}
