import { Search, Bell, Download } from 'lucide-react'

export default function Topbar() {
  return (
    <div className="h-16 border-b border-dark-600 bg-dark-800 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-white" id="page-title">Dashboard</h1>
        <p className="text-xs text-gray-400" id="page-subtitle">Resumen general del inventario</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="input-field pl-9 py-2 w-56 text-sm"
          />
        </div>
        <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white">
          <Download size={18} />
        </button>
      </div>
    </div>
  )
}
