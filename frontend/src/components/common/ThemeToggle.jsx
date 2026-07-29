import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
    >
      {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  )
}
