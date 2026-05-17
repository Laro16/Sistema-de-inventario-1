import { useState, useEffect } from 'react'
import { Users as UsersIcon, Shield, User, ToggleLeft, ToggleRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data ?? [])
    setLoading(false)
  }

  async function toggleActive(userId, currentState) {
    await supabase
      .from('profiles')
      .update({ active: !currentState })
      .eq('id', userId)
    toast.success(currentState ? 'Usuario desactivado' : 'Usuario activado')
    load()
  }

  async function toggleRole(userId, currentRole) {
    const newRole = currentRole === 'administrador' ? 'empleado' : 'administrador'
    await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
    toast.success(`Rol cambiado a ${newRole}`)
    load()
  }

  if (loading) return <div className="flex justify-center mt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Usuarios</h1>
          <p className="text-gray-400 text-sm">{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-dark-600">
              <tr>
                <th className="table-head text-left px-4 py-3">Usuario</th>
                <th className="table-head text-left px-4 py-3">Rol</th>
                <th className="table-head text-left px-4 py-3">Estado</th>
                <th className="table-head text-left px-4 py-3">Registro</th>
                <th className="table-head text-left px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.full_name?.charAt(0).toUpperCase() ?? 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.full_name}</p>
                        <p className="text-xs text-gray-400">{user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleRole(user.id, user.role)}
                      className={`badge ${
                        user.role === 'administrador'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-blue-500/15 text-blue-400'
                      } cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      {user.role === 'administrador' ? (
                        <><Shield size={10} /> Administrador</>
                      ) : (
                        <><User size={10} /> Empleado</>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        user.active
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}
                    >
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('es-GT')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(user.id, user.active)}
                      className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white"
                      title={user.active ? 'Desactivar' : 'Activar'}
                    >
                      {user.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-4 bg-amber-500/5 border-amber-500/20">
        <div className="flex items-start gap-3">
          <UsersIcon size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-400">Gestión de usuarios</p>
            <p className="text-xs text-gray-400 mt-1">
              Los usuarios se crean desde Supabase → Authentication. Aquí puedes cambiar roles y activar/desactivar cuentas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
