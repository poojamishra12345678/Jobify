import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiBriefcase, FiEye, FiEyeOff, FiUser, FiHome } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// Mirrors the backend's password policy: min 8 chars, upper, lower, digit, special char.
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&.#])[A-Za-z\d@$!%?&.#]{8,}$/

const schema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .matches(passwordRegex, 'Min 8 characters, with uppercase, lowercase, a number & a special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  course: Yup.string().when('accountType', {
    is: 'seeker',
    then: (s) => s.required('This field is required'),
  }),
  skills: Yup.string().when('accountType', {
    is: 'seeker',
    then: (s) => s.required('List a few skills'),
  }),
  companyName: Yup.string().when('accountType', {
    is: 'employer',
    then: (s) => s.required('Company name is required'),
  }),
})

export default function RegisterPage() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const formik = useFormik({
    initialValues: {
      accountType: 'seeker',
      name: '', email: '', password: '', confirmPassword: '',
      course: '', skills: '', companyName: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('')
      try {
        await register({
          name: values.name,
          email: values.email,
          password: values.password,
          // Backend requires course/skills on the student schema regardless
          // of account type — for employers we store their company name there.
          course: values.accountType === 'seeker' ? values.course : 'N/A',
          skills: values.accountType === 'seeker' ? values.skills : values.companyName,
          role: values.accountType === 'employer' ? 'admin' : 'student',
        })
        showToast('Account created! Please log in.', 'success')
        navigate('/login')
      } catch (error) {
        setServerError(error?.response?.data?.message || error.message || 'Registration failed')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const { values, setFieldValue } = formik

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center mb-3">
            <FiBriefcase size={18} />
          </span>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create your account</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join Jobify as a job seeker or employer</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setFieldValue('accountType', 'seeker')}
            className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-sm font-medium ${values.accountType === 'seeker' ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
          >
            <FiUser /> Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setFieldValue('accountType', 'employer')}
            className={`flex flex-col items-center gap-1 rounded-xl border py-3 text-sm font-medium ${values.accountType === 'employer' ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
          >
            <FiHome /> Employer
          </button>
        </div>

        {serverError && (
          <div className="bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-sm rounded-lg px-4 py-3 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full name</label>
            <input name="name" className="form-control" value={values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Jordan Lee" />
            {formik.touched.name && formik.errors.name && <p className="text-xs text-rose-600 mt-1">{formik.errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
            <input name="email" type="email" className="form-control" value={values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="you@example.com" />
            {formik.touched.email && formik.errors.email && <p className="text-xs text-rose-600 mt-1">{formik.errors.email}</p>}
          </div>

          {values.accountType === 'seeker' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Course / field of study</label>
                <input name="course" className="form-control" value={values.course} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="B.Tech Computer Science" />
                {formik.touched.course && formik.errors.course && <p className="text-xs text-rose-600 mt-1">{formik.errors.course}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Skills</label>
                <input name="skills" className="form-control" value={values.skills} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="React, Node.js, SQL" />
                {formik.touched.skills && formik.errors.skills && <p className="text-xs text-rose-600 mt-1">{formik.errors.skills}</p>}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Company name</label>
              <input name="companyName" className="form-control" value={values.companyName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Acme Inc." />
              {formik.touched.companyName && formik.errors.companyName && <p className="text-xs text-rose-600 mt-1">{formik.errors.companyName}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Password</label>
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} className="form-control pr-10" value={values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && <p className="text-xs text-rose-600 mt-1">{formik.errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Confirm password</label>
            <input name="confirmPassword" type={showPassword ? 'text' : 'password'} className="form-control" value={values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="••••••••" />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{formik.errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary w-full !py-2.5">
            {formik.isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Log in</Link>
        </p>
      </div>
    </div>
  )
}
