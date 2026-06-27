import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, FileText, Search, Briefcase, Download, MapPin, Clock } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import api from '../../utils/api'

const NAV = [
  { to: '/applicant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applicant/applications', icon: FileText, label: 'My Applications' },
  { to: '/', icon: Search, label: 'Browse Jobs' },
]

const STATUS_STEPS = ['applied', 'reviewed', 'interview', 'rejected']

const statusColor = {
  applied: 'badge-purple',
  reviewed: 'badge-orange',
  interview: 'badge-green',
  rejected: 'badge-red',
}

export default function MyApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/applications/my').then(({ data }) => setApps(data.applications)).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter)

  return (
    <DashboardLayout navItems={NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900">My Applications</h1>
        <p className="text-gray-500 text-sm mt-1">Track all your job applications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['all', 'applied', 'reviewed', 'interview', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-primary-300'
            }`}>{s}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="card h-28 animate-pulse bg-gray-50" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Briefcase size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No applications found</p>
          <Link to="/" className="btn-primary mt-4 inline-flex text-sm">Browse Jobs</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div key={app._id} className="card hover:shadow-card-hover transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg flex-shrink-0">
                  {app.job?.company?.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-bold text-dark-900">{app.job?.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{app.job?.company?.name}</p>
                    </div>
                    <span className={`badge ${statusColor[app.status]} flex-shrink-0`}>{app.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><MapPin size={12} />{app.job?.location || 'Remote'}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex gap-1">
                      {STATUS_STEPS.filter(s => s !== 'rejected').map((step, i) => {
                        const stepIndex = STATUS_STEPS.indexOf(app.status)
                        const currentIndex = STATUS_STEPS.filter(s => s !== 'rejected').indexOf(step)
                        const isActive = app.status !== 'rejected' && currentIndex <= STATUS_STEPS.filter(s => s !== 'rejected').indexOf(app.status)
                        return (
                          <div key={step} className={`flex-1 h-1.5 rounded-full transition-colors ${
                            app.status === 'rejected' ? 'bg-red-200' : isActive ? 'bg-primary-500' : 'bg-gray-200'
                          }`} />
                        )
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      {['Applied', 'Reviewed', 'Interview'].map(s => (
                        <span key={s} className="text-xs text-gray-400">{s}</span>
                      ))}
                    </div>
                  </div>

                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary-500 font-semibold hover:underline">
                      <Download size={13} /> View Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
