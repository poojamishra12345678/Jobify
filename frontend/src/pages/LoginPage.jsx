import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiBriefcase, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const schema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})

export default function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const from = location.state?.from?.pathname

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('')
      try {
        const user = await login(values)
        showToast(`Welcome back, ${user.name || 'there'}!`, 'success')
        navigate(from || (user.isEmployer ? '/employer/dashboard' : '/dashboard'), { replace: true })
      } catch (error) {
        setServerError(error?.response?.data?.message || error.message || 'Login failed')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-3">
            <FiBriefcase size={18} />
          </span>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Welcome back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Log in to continue to Jobify</p>
        </div>

        {serverError && (
          <div className="bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-sm rounded-lg px-4 py-3 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
            <input
              name="email" type="email" className="form-control"
              value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
              placeholder="you@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-rose-600 mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Password</label>
            <div className="relative">
              <input
                name="password" type={showPassword ? 'text' : 'password'} className="form-control pr-10"
                value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-xs text-rose-600 mt-1">{formik.errors.password}</p>
            )}
          </div>

          <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary w-full !py-2.5">
            {formik.isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account? <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
