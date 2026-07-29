import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-9 min-w-9 px-3 rounded-lg text-sm font-medium ${
            p === page
              ? 'bg-brand-600 text-white'
              : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </nav>
  )
}
