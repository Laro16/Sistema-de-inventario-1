import { useState } from 'react'
import { Plus, Search, Filter, Edit2, Trash2, Package } from 'lucide-react'
import { useProducts }      from '@/hooks/useProducts'
import { productsService }  from '@/services/products.service'
import { useAuth }          from '@/store/AuthContext'
import Spinner              from '@/components/ui/Spinner'
import Pagination           from '@/components/ui/Pagination'
import StockBadge           from '@/components/ui/StockBadge'
import ConfirmDialog        from '@/components/ui/ConfirmDialog'
import ProductModal         from '@/components/features/ProductModal'
import toast                from 'react-hot-toast'

export default function Products() {
  const { isAdmin } = useAuth()
  const { products, loading, page, totalPages, totalCount, setPage, filters, updateFilters, refresh } = useProducts()
  const [search,    setSearch]    = useState('')
  const [selected,  setSelected]  = useState(null)
  const [showForm,  setShowForm]  = useState(false)
  const [showDel,   setShowDel]   = useState(false)
  const [toDelete,  setToDelete]  = useState(null)

  function handleSearch(e) {
    setSearch(e.target.value)
    updateFilters({ search: e.target.value })
  }

  function openCreate() { setSelected(null); setShowForm(true) }
  function openEdit(p)  { setSelected(p);    setShowForm(true) }
  function openDelete(p){ setToDelete(p);    setShowDel(true)  }

  async function handleDelete() {
    await productsService.delete(toDelete.id)
    toast.success('Producto eliminado')
    setShowDel(false)
    refresh()
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Productos</h1>
          <p className="text-gray-400 text-sm">{totalCount} productos en inventario</p>
        </div>
        {isAdmin && (
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} /> Nuevo producto
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="card p-3 flex gap-3 items-center">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Buscar por nombre o SKU..."
            className="input-field pl-9"
          />
        </div>
        <Filter size={15} className="text-gray-400" />
        <span className="text-xs text-gray-400">Filtrar por estado:</span>
        {['todos', 'bajo', 'agotado'].map(f => (
          <button
            key={f}
            onClick={() => updateFilters({ statusFilter: f })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filters.statusFilter === f ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-dark-700'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-500">
            <Package size={40} className="mb-3 opacity-30" />
            <p className="font-medium">No se encontraron productos</p>
            <p className="text-sm">Crea tu primer producto para empezar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-dark-600">
                <tr>
                  {['Producto', 'SKU', 'Categoría', 'P. Compra', 'P. Venta', 'Stock', 'Estado', isAdmin ? 'Acciones' : ''].filter(Boolean).map(h => (
                    <th key={h} className="table-head text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="table-row">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-dark-600 flex items-center justify-center flex-shrink-0">
                            <Package size={14} className="text-gray-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">{p.name}</p>
                          {p.description && <p className="text-xs text-gray-500 truncate max-w-[180px]">{p.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300 font-mono">{p.sku ?? '—'}</td>
                    <td className="px-4 py-3">
                      {p.categories ? (
                        <span className="badge" style={{ background: p.categories.color + '20', color: p.categories.color }}>
                          {p.categories.name}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">Q{Number(p.purchase_price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">Q{Number(p.sale_price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{p.stock}</span>
                        <span className="text-xs text-gray-500">/ mín {p.min_stock}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StockBadge stock={p.stock} minStock={p.min_stock} /></td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => openDelete(p)} className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-400 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-dark-600 flex justify-end">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Modales */}
      <ProductModal
        open={showForm}
        onClose={() => setShowForm(false)}
        product={selected}
        onSaved={() => { setShowForm(false); refresh() }}
      />
      <ConfirmDialog
        open={showDel}
        onClose={() => setShowDel(false)}
        onConfirm={handleDelete}
        title="¿Eliminar producto?"
        message={`¿Seguro que deseas eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  )
}
