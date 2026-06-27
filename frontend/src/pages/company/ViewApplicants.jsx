import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ArrowLeft, Download, Mail, User } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/company/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/company/post-job', icon: PlusCircle, label: 'Post a Job' },
]

const STATUSES = ['applied', 'reviewed', 'interview', 'rejected']
const statusColor = {
  applied: 'badge-purple', reviewed: 'badge-orange',
  interview: 'badge-green', rejected: 'badge-red',
}

export default function ViewApplicants() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [jobTitle, setJobTitle] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/applications/job/${jobId}`).then(({ data }) => {
      setApplications(data.applications)
      setJobTitle(data.jobTitle)
    }).finally(() => setLoading(false))
  }, [jobId])

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status })
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a))
      toast.success(`Status updated to ${status}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <DashboardLayout navItems={NAV}>
      <button onClick={() => navigate('/company/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-500 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900">Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">{jobTitle} · {applications.length} applications</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="card h-24 animate-pulse bg-gray-50" />)}</div>
      ) : applications.length === 0 ? (
        <div className="card text-center py-16">
          <User size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No applications yet</p>
          <p className="text-gray-300 text-sm mt-1">Share your job listing to attract candidates</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                  {app.applicant?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-bold text-dark-900">{app.applicant?.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {app.applicant?.email}
                      </p>
                    </div>
                    <span className={`badge ${statusColor[app.status]}`}>{app.status}</span>
                  </div>

                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-surface rounded-xl">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Cover Letter</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-primary-500 font-semibold hover:underline">
                        <Download size={13} /> Download Resume
                      </a>
                    )}
                    <div className="flex gap-2 ml-auto flex-wrap">
                      {STATUSES.filter(s => s !== app.status).map(s => (
                        <button key={s} onClick={() => updateStatus(app._id, s)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors capitalize ${
                            s === 'interview' ? 'border-green-300 text-green-700 hover:bg-green-50'
                            : s === 'rejected' ? 'border-red-300 text-red-600 hover:bg-red-50'
                            : s === 'reviewed' ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
                            : 'border-primary-300 text-primary-600 hover:bg-primary-50'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
