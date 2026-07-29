export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-start gap-4">
        <div className="skeleton h-12 w-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/3" />
          <div className="flex gap-2 pt-2">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}
