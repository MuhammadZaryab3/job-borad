import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, FileText, Search, Briefcase, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import DashboardLayout from '../../components/common/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const NAV = [
  { to: '/applicant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/applicant/applications', icon: FileText, label: 'My Applications' },
  { to: '/', icon: Search, label: 'Browse Jobs' },
]

const statusColor = {
  applied: 'badge-purple',
  reviewed: 'badge-orange',
  interview: 'badge-green',
  rejected: 'badge-red',
}

export default function ApplicantDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, reviewed: 0, interview: 0, rejected: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/applications/my').then(({ data }) => {
      const apps = data.applications
      setRecent(apps.slice(0, 4))
      setStats({
        total: apps.length,
        reviewed: apps.filter(a => a.status === 'reviewed').length,
        interview: apps.filter(a => a.status === 'interview').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
      })
    }).finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Applied', value: stats.total, icon: Briefcase, color: 'bg-primary-100 text-primary-600' },
    { label: 'Under Review', value: stats.reviewed, icon: Clock, color: 'bg-orange-100 text-orange-600' },
    { label: 'Interviews', value: stats.interview, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-100 text-red-600' },
  ]

  return (
    <DashboardLayout navItems={NAV}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your job search overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-dark-900">{loading ? '—' : value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-dark-900 flex items-center gap-2"><TrendingUp size={18} className="text-primary-500" /> Recent Applications</h2>
          <Link to="/applicant/applications" className="text-primary-500 text-sm font-semibold hover:underline">View all</Link>
        </div>

        {loading ? (
          <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : recent.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No applications yet</p>
            <Link to="/" className="btn-primary mt-4 inline-flex text-sm">Browse Jobs</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map(app => (
              <div key={app._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold flex-shrink-0">
                  {app.job?.company?.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark-900 text-sm truncate">{app.job?.title}</p>
                  <p className="text-xs text-gray-400">{app.job?.company?.name} · {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge ${statusColor[app.status]} flex-shrink-0`}>{app.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
