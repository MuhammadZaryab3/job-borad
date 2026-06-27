import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, Briefcase, Filter, ChevronRight, Building2, Clock, DollarSign } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const TYPES = ['All', 'Full-time', 'Part-time', 'Remote', 'Freelance', 'Internship']
const SKILLS = ['All Skills', 'React', 'Node.js', 'Python', 'Design', 'Marketing', 'DevOps']

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [skill, setSkill] = useState('All Skills')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
  }, [search, type, skill])

  const fetchJobs = async () => {
    try {
      const params = {}
      if (search) params.search = search
      if (type !== 'All') params.type = type
      if (skill !== 'All Skills') params.skill = skill
      const { data } = await api.get('/jobs', { params })
      setJobs(data.jobs)
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleApply = (jobId) => {
    if (!user) return navigate('/login')
    if (user.role === 'company') return
    navigate(`/jobs/${jobId}`)
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="bg-dark-900 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <Briefcase size={17} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white">Jobie</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to={user.role === 'company' ? '/company/dashboard' : '/applicant/dashboard'}
              className="btn-primary text-sm px-4 py-2">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-indigo-200 hover:text-white text-sm font-medium hidden sm:block">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero search */}
      <div className="bg-dark-900 px-4 sm:px-8 pb-12 pt-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Find Your Dream Job</h1>
          <p className="text-indigo-300 mb-8 text-sm sm:text-base">Thousands of jobs from top companies — apply in one click</p>
          <div className="flex gap-3 bg-white rounded-2xl p-2 shadow-xl">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Job title, company, or keyword..."
                className="flex-1 outline-none text-sm text-dark-900 placeholder-gray-400" />
            </div>
            <button className="btn-primary text-sm px-5 py-2.5 rounded-xl">Search</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                type === t ? 'bg-primary-500 text-white' : 'bg-white text-gray-500 hover:border-primary-300 border border-gray-200'
              }`}>{t}</button>
          ))}
        </div>

        {/* Skill tags */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {SKILLS.map(s => (
            <button key={s} onClick={() => setSkill(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                skill === s ? 'bg-primary-100 text-primary-600 border border-primary-300' : 'bg-white text-gray-500 border border-gray-200 hover:border-primary-200'
              }`}>{s}</button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">Showing <span className="font-semibold text-dark-900">{jobs.length}</span> job results</p>
        </div>

        {/* Jobs grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="card h-48 animate-pulse bg-gray-100" />)}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No jobs found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map(job => (
              <div key={job._id} className="card hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
                onClick={() => handleApply(job._id)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg flex-shrink-0">
                    {job.company?.name?.charAt(0) || 'C'}
                  </div>
                  <span className={`badge ${job.type === 'Remote' ? 'badge-green' : job.type === 'Full-time' ? 'badge-purple' : 'badge-orange'}`}>
                    {job.type}
                  </span>
                </div>

                <h3 className="font-bold text-dark-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                  <Building2 size={13} /> {job.company?.name}
                </p>

                {job.salary && (
                  <p className="text-sm font-semibold text-primary-600 mb-3 flex items-center gap-1.5">
                    <DollarSign size={13} /> {job.salary}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} /> {job.location || 'Remote'}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} /> {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
