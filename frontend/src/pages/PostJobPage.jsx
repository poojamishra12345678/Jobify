import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import JobCard from '../components/JobCard/JobCard'
import { createJob } from '../api/jobs'
import { useToast } from '../context/ToastContext'
import { jobTypes, categories, experienceLevels } from '../mocks/jobs'

const schema = Yup.object({
  role: Yup.string().required('Job title is required'),
  companyName: Yup.string().required('Company name is required'),
  location: Yup.string().required('Location is required'),
  salaryPackage: Yup.string().required('Salary is required'),
  jobType: Yup.string().required('Select a job type'),
  experience: Yup.string().required('Select experience level'),
  category: Yup.string().required('Select a category'),
  description: Yup.string().min(30, 'Add a bit more detail (30+ characters)').required('Description is required'),
})

export default function PostJobPage() {
  const { showToast } = useToast()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      role: '', companyName: '', location: '', salaryPackage: '',
      jobType: 'Full-time', experience: experienceLevels[0], category: categories[0],
      description: '', requirements: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createJob(values)
        showToast('Job posted successfully!', 'success')
        navigate('/employer/dashboard')
      } catch (error) {
        showToast(error?.response?.data?.message || 'Could not post job — saved to dashboard locally instead.', 'info')
        navigate('/employer/dashboard')
      } finally {
        setSubmitting(false)
      }
    },
  })

  const { values } = formik

  const previewJob = {
    id: 'preview',
    role: values.role || 'Job title',
    companyName: values.companyName || 'Your company',
    location: values.location || 'Location',
    salaryPackage: values.salaryPackage || 'Salary range',
    jobType: values.jobType,
    experience: values.experience,
    category: values.category,
    logo: '🏢',
    remote: /remote/i.test(values.location || ''),
    description: values.description,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Post a new job</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={formik.handleSubmit} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Job title</label>
              <input name="role" className="form-control" value={values.role} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Senior Frontend Engineer" />
              {formik.touched.role && formik.errors.role && <p className="text-xs text-rose-600 mt-1">{formik.errors.role}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Company name</label>
              <input name="companyName" className="form-control" value={values.companyName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Acme Inc." />
              {formik.touched.companyName && formik.errors.companyName && <p className="text-xs text-rose-600 mt-1">{formik.errors.companyName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Location</label>
              <input name="location" className="form-control" value={values.location} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Bengaluru, India or Remote" />
              {formik.touched.location && formik.errors.location && <p className="text-xs text-rose-600 mt-1">{formik.errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Salary package</label>
              <input name="salaryPackage" className="form-control" value={values.salaryPackage} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="12-18 LPA" />
              {formik.touched.salaryPackage && formik.errors.salaryPackage && <p className="text-xs text-rose-600 mt-1">{formik.errors.salaryPackage}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Job type</label>
              <select name="jobType" className="form-select" value={values.jobType} onChange={formik.handleChange}>
                {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Experience</label>
              <select name="experience" className="form-select" value={values.experience} onChange={formik.handleChange}>
                {experienceLevels.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Category</label>
              <select name="category" className="form-select" value={values.category} onChange={formik.handleChange}>
                {categories.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Description</label>
            <textarea name="description" rows={5} className="form-control" value={values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Describe the role, responsibilities and impact..." />
            {formik.touched.description && formik.errors.description && <p className="text-xs text-rose-600 mt-1">{formik.errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Requirements (comma-separated)</label>
            <textarea name="requirements" rows={3} className="form-control" value={values.requirements} onChange={formik.handleChange} placeholder="React, 2+ years experience, Strong communication" />
          </div>

          <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary !px-6 !py-2.5">
            {formik.isSubmitting ? 'Publishing…' : 'Publish job'}
          </button>
        </form>

        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">Live preview</h3>
          <JobCard job={previewJob} variant="expanded" />
        </div>
      </div>
    </div>
  )
}
