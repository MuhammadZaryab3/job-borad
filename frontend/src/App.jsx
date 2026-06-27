import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import JobsPage from './pages/public/JobsPage'
import JobDetail from './pages/public/JobDetail'
import ApplicantDashboard from './pages/applicant/Dashboard'
import MyApplications from './pages/applicant/MyApplications'
import CompanyDashboard from './pages/company/Dashboard'
import PostJob from './pages/company/PostJob'
import ViewApplicants from './pages/company/ViewApplicants'

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', fontFamily: 'Inter' } }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Applicant */}
          <Route path="/applicant/dashboard" element={<ProtectedRoute role="applicant"><ApplicantDashboard /></ProtectedRoute>} />
          <Route path="/applicant/applications" element={<ProtectedRoute role="applicant"><MyApplications /></ProtectedRoute>} />

          {/* Company */}
          <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
          <Route path="/company/post-job" element={<ProtectedRoute role="company"><PostJob /></ProtectedRoute>} />
          <Route path="/company/applicants/:jobId" element={<ProtectedRoute role="company"><ViewApplicants /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
