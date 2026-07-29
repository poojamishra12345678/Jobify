import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiSave } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { updateUserProfile } from '../api/users'

const schema = Yup.object({
  name: Yup.string().required('Name is required'),
  course: Yup.string(),
  skills: Yup.string(),
})

export default function ProfileSettingsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [notifPrefs, setNotifPrefs] = useState({
    jobAlerts: true, applicationUpdates: true, marketing: false,
  })

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      course: user?.course || '',
      skills: user?.skills || '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (user?._id || user?.id) {
          await updateUserProfile(user._id || user.id, values)
        }
        const stored = JSON.parse(localStorage.getItem('jobify_user') || '{}')
        localStorage.setItem('jobify_user', JSON.stringify({ ...stored, ...values }))
        showToast('Profile updated', 'success')
      } catch {
        showToast('Could not reach server — changes saved locally.', 'info')
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Profile & settings</h1>

      <form onSubmit={formik.handleSubmit} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 mb-6">
        <h2 className="font-bold text-slate-800 dark:text-slate-100">Personal info</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full name</label>
          <input name="name" className="form-control" value={formik.values.name} onChange={formik.handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
          <input className="form-control" value={user?.email || ''} disabled />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Course / field</label>
            <input name="course" className="form-control" value={formik.values.course} onChange={formik.handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Skills</label>
            <input name="skills" className="form-control" value={formik.values.skills} onChange={formik.handleChange} />
          </div>
        </div>
        <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary !px-5 !py-2 text-sm inline-flex items-center gap-2">
          <FiSave size={14} /> {formik.isSubmitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Notification preferences</h2>
        <div className="space-y-3">
          {[
            { key: 'jobAlerts', label: 'New job alerts matching my profile' },
            { key: 'applicationUpdates', label: 'Application status updates' },
            { key: 'marketing', label: 'Product news & tips' },
          ].map((pref) => (
            <label key={pref.key} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
              <span className="text-sm text-slate-600 dark:text-slate-300">{pref.label}</span>
              <input
                type="checkbox"
                checked={notifPrefs[pref.key]}
                onChange={() => setNotifPrefs((p) => ({ ...p, [pref.key]: !p[pref.key] }))}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-400"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
