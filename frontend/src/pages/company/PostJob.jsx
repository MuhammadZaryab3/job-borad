import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, Briefcase } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/post-job', icon: PlusCircle, label: 'Post a Job' },
]

const TYPES = ['Full-time', 'Part-time', 'Remote', 'Freelance', 'Internship']

export default function PostJob() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', type: 'Full-time', location: '', salary: '',
    description: '', requirements: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.description) return toast.error('Title and description are required')
    setLoading(true)
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
      }
      await api.post('/jobs', payload)
      toast.success('Job posted successfully!')
      navigate('/company/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout navItems={NAV}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-900">Post a New Job</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to attract the right candidates</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-5">
          <div>
            <label className="block text-sm font-semibold text-dark-900 mb-1.5">Job Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Senior Frontend Developer" className="input" required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-1.5">Job Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="input">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark-900 mb-1.5">Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g. London, UK or Remote" className="input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-900 mb-1.5">Salary Range</label>
            <input value={form.salary} onChange={e => set('salary', e.target.value)}
              placeholder="e.g. Rs 60,000 – Rs 80,000" className="input" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-900 mb-1.5">Job Description *</label>
            <textarea rows={5} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the role, responsibilities, and what makes this a great opportunity..."
              className="input resize-none" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark-900 mb-1.5">
              Requirements <span className="text-gray-400 font-normal">(one per line)</span>
            </label>
            <textarea rows={4} value={form.requirements} onChange={e => set('requirements', e.target.value)}
              placeholder={"3+ years React experience\nStrong TypeScript skills\nExperience with REST APIs"}
              className="input resize-none font-mono text-xs" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/company/dashboard')}
              className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Briefcase size={16} /> Post Job</>}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
