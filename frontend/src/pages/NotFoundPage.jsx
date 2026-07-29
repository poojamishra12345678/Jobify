import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-7xl mb-4">🧭</span>
      <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">404 — Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn btn-primary !px-6 !py-2.5 mt-6">Back to home</Link>
    </div>
  )
}
