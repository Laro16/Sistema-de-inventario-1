import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/store/AuthContext'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import MainLayout from '@/components/layout/MainLayout'
import Login       from '@/pages/Login'
import Dashboard   from '@/pages/Dashboard'
import Products    from '@/pages/Products'
import Movements   from '@/pages/Movements'
import Alerts      from '@/pages/Alerts'
import Reports     from '@/pages/Reports'
import Categories  from '@/pages/Categories'
import Users       from '@/pages/Users'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/productos"   element={<Products />} />
          <Route path="/movimientos" element={<Movements />} />
          <Route path="/alertas"     element={<Alerts />} />
          <Route path="/reportes"    element={<Reports />} />
          <Route path="/categorias"  element={
            <ProtectedRoute adminOnly>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/usuarios" element={
            <ProtectedRoute adminOnly>
              <Users />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
