import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, ArrowLeftRight, Bell, BarChart2,
  Tags, Users, Settings, LogOut, Package2
} from 'lucide-react'
import { useAuth } from '@/store/AuthContext'
import clsx from 'clsx'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard,  label: 'Dashboard',    section: 'Principal' },
  { to: '/productos',   icon: Package,           label: 'Productos',    section: 'Principal' },
  { to: '/movimientos', icon: ArrowLeftRight,    label: 'Movimientos',  section: 'Principal' },
  { to: '/alertas',     icon: Bell,              label: 'Alertas',      section: 'Análisis', badge: 'warn' },
  { to: '/reportes',    icon: BarChart2,         label: 'Reportes',     section: 'Análisis' },
  { to: '/categorias',  icon: Tags,              label: 'Categorías',   section: 'Config', adminOnly: true },
  { to: '/usuarios',    icon: Users,             label: 'Usuarios',     section: 'Config', adminOnly: true },
]

export default function Sidebar() {
  const { profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    toast.success('Sesión cerrada')
    navigate('/login')
  }

  const sections = [...new Set(navItems.map(i => i.section))]
  const filtered = navItems.filter(i => !i.adminOnly || isAdmin)

  return (
    <aside className="w-56 bg-dark-800 border-r border-dark-600 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-dark-600 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Package2 size={16} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-white leading-none">StockGT</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Inventario</div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {sections.map(section => {
          const items = filtered.filter(i => i.section === section)
          if (!items.length) return null
          return (
            <div key={section} className="mb-4">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2 mb-1">
                {section}
              </p>
              {items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium mb-0.5 transition-all duration-150',
                    isActive
                      ? 'bg-primary-500/15 text-primary-400'
                      : 'text-gray-400 hover:bg-dark-700 hover:text-gray-200'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </div>
          )
        })}
      </nav>

      {/* Footer de usuario */}
      <div className="p-3 border-t border-dark-600">
        <div className="flex items-center gap-2.5 mb-2 px-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{profile?.full_name}</p>
            <p className="text-[10px] text-primary-400 capitalize">{profile?.role}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
