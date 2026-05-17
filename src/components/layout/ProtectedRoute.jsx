import { Navigate } from 'react-router-dom'
import { useAuth } from '@/store/AuthContext'
import Spinner from '@/components/ui/Spinner'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><Spinner size="lg" /></div>
  if (!user)   return <Navigate to="/login" replace />
  if (adminOnly && profile?.role !== 'administrador') return <Navigate to="/dashboard" replace />

  return children
}
