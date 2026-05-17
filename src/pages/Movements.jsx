import { useState } from 'react'
import { Plus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useMovements }      from '@/hooks/useMovements'
import { movementsService }  from '@/services/movements.service'
import { useAuth }           from '@/store/AuthContext'
import Spinner               from '@/components/ui/Spinner'
import Pagination            from '@/components/ui/Pagination'
import MovementModal         from '@/components/features/MovementModal'
import { format, parseISO }  from 'date-fns'
import { es }                from 'date-fns/locale'
import toast                 from 'react-hot-toast'

export default function Movements() {
  const { user } = useAuth()
  const { movements, loading, page, totalPages, setPage, filters, updateFilters, refresh } = useMovements()
  const [showModal, setShowModal] = useState(false)

  async function handleCreate(values) {
    await movementsService.create({ ...values, userId: user.id })
    toast.success('Movimiento registrado')
    setShowModal(false)
    refresh()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Movimientos</h1>
          <p className="text-gray-400 text-sm">Registro de entradas y salidas de inventario</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} /> Registrar movimiento
        </button>
      </div>

      {/* Filtros rápidos */}
      <div className="card p-3 flex flex-wrap gap-3 items-center">
        <span className="text-xs text-gray-400">Filtrar por tipo:</span>
        {[['', 'Todos'], ['entrada', 'Entradas'], ['salida', 'Salidas']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => updateFilters({ type: val })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors
              ${filters.type === val
                ? val === 'entrada' ? 'bg-emerald-500/20 text-emerald-400'
                : val === 'salida' ? 'bg-red-500/20 text-red-400'
                : 'bg-primary-500 text-white'
                : 'text-gray-400 hover:bg-dark-700'}`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <input type="date" onChange={e => updateFilters({ from: e.target.value })} className="input-field py-1.5 text-xs" />
          <span className="text-gray-500 text-xs">–</span>
          <input type="date" onChange={e => updateFilters({ to: e.target.value })} className="input-field py-1.5 text-xs" />
        </div>
      </div>

      {/* Lista */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-dark-600">
                <tr>
                  {['Tipo', 'Producto', 'SKU', 'Cantidad', 'Stock', 'Usuario', 'Nota', 'Fecha'].map(h => (
                    <th key={h} className="table-head text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {movements.map(m => (
                  <tr key={m.id} className="table-row">
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${m.type === 'entrada' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                        {m.type === 'entrada' ? <ArrowDownCircle size={12}/> : <ArrowUpCircle size={12}/>}
                        {m.type}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{m.products?.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono">{m.products?.sku ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${m.type === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {m.previous_stock} → <span className="text-white font-medium">{m.new_stock}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300">{m.profiles?.full_name}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[150px] truncate">{m.note ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {format(parseISO(m.created_at), "d MMM yyyy HH:mm", { locale: es })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-dark-600 flex justify-end">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      <MovementModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreate} />
    </div>
  )
}
