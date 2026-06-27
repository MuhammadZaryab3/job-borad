import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, DollarSign, Building2, Briefcase, Upload, FileText } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [resume, setResume] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(({ data }) => { setJob(data.job); setApplied(data.hasApplied) })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (!resume) return toast.error('Please upload your resume')
    setApplying(true)
    try {
      const fd = new FormData()
      fd.append('resume', resume)
      fd.append('coverLetter', coverLetter)
      await api.post(`/applications/jobs/${id}/apply`, fd)
      toast.success('Application submitted!')
      setApplied(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="bg-dark-900 px-4 sm:px-8 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-indigo-300 hover:text-white flex items-center gap-2 text-sm">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
            <Briefcase size={13} className="text-white" />
          </div>
          <span className="font-bold text-white">Jobie</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl flex-shrink-0">
                {job.company?.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-dark-900 mb-1">{job.title}</h1>
                <p className="text-gray-500 flex items-center gap-1.5 text-sm"><Building2 size={14} /> {job.company?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {[
                { icon: MapPin, val: job.location || 'Remote' },
                { icon: Clock, val: job.type },
                { icon: DollarSign, val: job.salary || 'Not specified' },
              ].map(({ icon: Icon, val }) => (
                <div key={val} className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5">
                  <Icon size={15} className="text-primary-500 flex-shrink-0" />
                  <span className="text-sm text-dark-900 font-medium truncate">{val}</span>
                </div>
              ))}
            </div>

            <h2 className="font-bold text-dark-900 mb-3">Job Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{job.description}</p>

            {job.requirements?.length > 0 && (
              <>
                <h2 className="font-bold text-dark-900 mt-6 mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Apply card */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="font-bold text-dark-900 mb-4">Apply for this job</h2>
            {!user ? (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm mb-4">Sign in to apply for this position</p>
                <Link to="/login" className="btn-primary w-full">Sign In to Apply</Link>
              </div>
            ) : user.role === 'company' ? (
              <p className="text-gray-400 text-sm text-center py-4">Companies cannot apply for jobs.</p>
            ) : applied ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText size={22} className="text-green-600" />
                </div>
                <p className="font-semibold text-green-700">Application Submitted!</p>
                <p className="text-gray-400 text-xs mt-1">Track it in your dashboard</p>
                <Link to="/applicant/applications" className="btn-outline w-full mt-4 text-sm">View Applications</Link>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-900 mb-1.5">Resume (PDF)</label>
                  <label className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${resume ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                    <Upload size={20} className={resume ? 'text-primary-500' : 'text-gray-400'} />
                    <span className="text-xs text-center text-gray-500">
                      {resume ? resume.name : 'Click to upload PDF'}
                    </span>
                    <input type="file" accept=".pdf" className="hidden"
                      onChange={e => setResume(e.target.files[0])} />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-900 mb-1.5">Cover Letter <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea rows={4} placeholder="Why are you a great fit?" value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    className="input resize-none text-sm" />
                </div>
                <button type="submit" disabled={applying} className="btn-primary w-full">
                  {applying ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
