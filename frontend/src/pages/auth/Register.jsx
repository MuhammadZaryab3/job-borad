import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Building2, Briefcase, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [role, setRole] = useState('applicant')
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const user = await register({ ...form, role })
      toast.success('Account created successfully!')
      navigate(user.role === 'company' ? '/company/dashboard' : '/applicant/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-dark-900 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-primary-500"
              style={{ width: `${80 + i * 60}px`, height: `${80 + i * 60}px`, top: `${10 + i * 12}%`, left: `${-20 + i * 15}%`, opacity: 0.3 - i * 0.04 }} />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-12">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center">
              <Briefcase size={22} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Jobie</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Join Thousands<br />of Professionals</h2>
          <p className="text-indigo-300 text-lg max-w-sm mb-10">Whether you're hiring or looking — Jobie connects you.</p>
          {['Free to join', 'Instant job matches', 'Direct applications'].map(t => (
            <div key={t} className="flex items-center gap-3 mb-3 text-left">
              <CheckCircle2 size={18} className="text-primary-400 flex-shrink-0" />
              <span className="text-indigo-200 text-sm">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Briefcase size={18} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-dark-900">Jobie</span>
          </div>

          <h1 className="text-3xl font-bold text-dark-900 mb-1">Create account</h1>
          <p className="text-gray-500 mb-6">Join Jobie for free</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'applicant', label: 'Job Seeker', icon: User, desc: 'Find jobs & apply' },
              { value: 'company', label: 'Company', icon: Building2, desc: 'Post jobs & hire' },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button key={value} type="button" onClick={() => setRole(value)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  role === value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-200'
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${role === value ? 'bg-primary-500' : 'bg-gray-100'}`}>
                  <Icon size={16} className={role === value ? 'text-white' : 'text-gray-500'} />
                </div>
                <div className={`font-semibold text-sm ${role === value ? 'text-primary-600' : 'text-dark-900'}`}>{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-900 mb-1.5">{role === 'company' ? 'Company Name' : 'Full Name'}</label>
              <div className="relative">
                {role === 'company' ? <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /> : <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />}
                <input type="text" placeholder={role === 'company' ? 'Acme Corp' : 'John Doe'}
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input pl-10" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-900 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input pl-10" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-900 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
