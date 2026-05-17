import { useEffect, useState } from 'react'
import { AlertTriangle, XCircle, RefreshCw } from 'lucide-react'
import { productsService }  from '@/services/products.service'
import StockBadge           from '@/components/ui/StockBadge'
import Spinner              from '@/components/ui/Spinner'

export default function Alerts() {
  const [lowStock,    setLow]     = useState([])
  const [outOfStock,  setOut]     = useState([])
  const [loading,     setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [low, out] = await Promise.all([
      productsService.getLowStock(),
      productsService.getOutOfStock(),
    ])
    setLow(low); setOut(out)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="flex justify-center mt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Alertas</h1>
          <p className="text-gray-400 text-sm">{lowStock.length + outOfStock.length} productos requieren atención</p>
        </div>
        <button onClick={load} className="btn-secondary"><RefreshCw size={14}/> Actualizar</button>
      </div>

      {/* Agotados */}
      {outOfStock.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={16} className="text-red-400" />
            <h2 className="text-sm font-semibold text-red-400">Productos agotados ({outOfStock.length})</h2>
          </div>
          <div className="card overflow-hidden">
            <div className="divide-y divide-dark-600">
              {outOfStock.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <XCircle size={14} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.categories?.name ?? 'Sin categoría'} · SKU: {p.sku ?? '—'}</p>
                  </div>
                  <StockBadge stock={p.stock} minStock={p.min_stock} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stock bajo */}
      {lowStock.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-amber-400">Stock bajo ({lowStock.length})</h2>
          </div>
          <div className="card overflow-hidden">
            <div className="divide-y divide-dark-600">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={14} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.categories?.name ?? 'Sin categoría'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-400">{p.stock} {p.unit}</p>
                    <p className="text-xs text-gray-500">mín. {p.min_stock}</p>
                  </div>
                  <StockBadge stock={p.stock} minStock={p.min_stock} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {lowStock.length === 0 && outOfStock.length === 0 && (
        <div className="card py-16 flex flex-col items-center text-gray-500">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mb-3">
            <AlertTriangle size={20} className="text-emerald-400" />
          </div>
          <p className="font-medium text-white">¡Todo bajo control!</p>
          <p className="text-sm">No hay alertas de inventario en este momento.</p>
        </div>
      )}
    </div>
  )
}
