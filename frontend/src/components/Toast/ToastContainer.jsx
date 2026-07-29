import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi'

const icons = {
  success: <FiCheckCircle className="text-accent-500 shrink-0" size={20} />,
  error: <FiXCircle className="text-rose-500 shrink-0" size={20} />,
  info: <FiInfo className="text-brand-500 shrink-0" size={20} />,
}

export default function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-[92vw] max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 rounded-xl bg-white dark:bg-slate-800 shadow-card border border-slate-100 dark:border-slate-700 px-4 py-3 animate-[fadeIn_.2s_ease-out]"
        >
          {icons[t.type] || icons.info}
          <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{t.message}</p>
          <button onClick={() => onClose(t.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
