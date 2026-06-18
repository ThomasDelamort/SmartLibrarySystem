import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Gate a route behind auth (and optionally a specific role).
//   <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth()

    if (loading) return null // could render a spinner while /api/me resolves

    if (!user) return <Navigate to="/login" replace />
    if (role && user.role !== role) return <Navigate to="/" replace />

    return children
}