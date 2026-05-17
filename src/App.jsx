import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/store/AuthContext.jsx'
import ProtectedRoute from '@/components/layout/ProtectedRoute.jsx'
import MainLayout from '@/components/layout/MainLayout.jsx'
import Login       from '@/pages/Login.jsx'
import Dashboard   from '@/pages/Dashboard.jsx'
import Products    from '@/pages/Products.jsx'
import Movements   from '@/pages/Movements.jsx'
import Alerts      from '@/pages/Alerts.jsx'
import Reports     from '@/pages/Reports.jsx'
import Categories  from '@/pages/Categories.jsx'
import Users       from '@/pages/Users.jsx'

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
