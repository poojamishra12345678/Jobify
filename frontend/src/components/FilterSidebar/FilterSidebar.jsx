import { categories, jobTypes, experienceLevels } from '../../mocks/jobs'

function CheckboxGroup({ title, options, selected, onChange }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt))
    else onChange([...selected, opt])
  }
  return (
    <div className="py-4 border-b border-slate-100 dark:border-slate-800">
      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-400"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function FilterSidebar({ filters, setFilters, onReset }) {
  return (
    <aside className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 h-fit sticky top-20">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Filters</h3>
        <button onClick={onReset} className="text-xs font-medium text-brand-600 hover:text-brand-700">
          Reset all
        </button>
      </div>

      <CheckboxGroup
        title="Job type"
        options={jobTypes}
        selected={filters.jobType}
        onChange={(v) => setFilters((f) => ({ ...f, jobType: v }))}
      />
      <CheckboxGroup
        title="Experience"
        options={experienceLevels}
        selected={filters.experience}
        onChange={(v) => setFilters((f) => ({ ...f, experience: v }))}
      />
      <CheckboxGroup
        title="Category"
        options={categories}
        selected={filters.category}
        onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
      />

      <div className="py-4">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Minimum salary (LPA)</h4>
        <input
          type="range"
          min="0"
          max="30"
          value={filters.minSalary}
          onChange={(e) => setFilters((f) => ({ ...f, minSalary: Number(e.target.value) }))}
          className="w-full accent-brand-600"
        />
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">₹{filters.minSalary} LPA+</div>
      </div>
    </aside>
  )
}
