import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, Users, Briefcase, Eye, Trash2, TrendingUp } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/post-job', icon: PlusCircle, label: 'Post a Job' },
]

export default function CompanyDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/jobs/mine').then(({ data }) => setJobs(data.jobs)).finally(() => setLoading(false))
  }, [])

  const deleteJob = async (id) => {
    if (!confirm('Delete this job listing?')) return
    try {
      await api.delete(`/jobs/${id}`)
      setJobs(prev => prev.filter(j => j._id !== id))
      toast.success('Job deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0)

  return (
    <DashboardLayout navItems={NAV}>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Welcome, {user?.name}! 🏢</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your job listings</p>
        </div>
        <Link to="/company/post-job" className="btn-primary text-sm">
          <PlusCircle size={16} /> Post a Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'bg-primary-100 text-primary-600' },
          { label: 'Total Applicants', value: totalApps, icon: Users, color: 'bg-green-100 text-green-600' },
          { label: 'Avg per Job', value: jobs.length ? Math.round(totalApps / jobs.length) : 0, icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-dark-900">{loading ? '—' : value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <div className="card">
        <h2 className="font-bold text-dark-900 mb-5 flex items-center gap-2">
          <Briefcase size={18} className="text-primary-500" /> Your Job Listings
        </h2>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No jobs posted yet</p>
            <Link to="/company/post-job" className="btn-primary mt-4 inline-flex text-sm">Post Your First Job</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job._id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface hover:bg-primary-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark-900 truncate">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="text-xs text-gray-400">{job.type}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{job.location || 'Remote'}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs font-semibold text-primary-600">{job.applicationCount || 0} applicants</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/company/applicants/${job._id}`}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-primary-500 hover:bg-primary-50 transition-colors">
                    <Eye size={16} />
                  </Link>
                  <button onClick={() => deleteJob(job._id)}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
