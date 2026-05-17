import { useState, useEffect } from 'react'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardService }  from '@/services/dashboard.service'
import { movementsService }  from '@/services/movements.service'
import { exportToExcel, exportToPDF } from '@/utils/exporters'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'

export default function Reports() {
  const [topProducts, setTopProducts] = useState([])
  const [summary,     setSummary]     = useState({ entrada: 0, salida: 0 })
  const [loading,     setLoading]     = useState(true)
  const [exporting,   setExporting]   = useState(false)

  useEffect(() => {
    Promise.all([
      dashboardService.getTopProducts(10),
      movementsService.getSummary(),
    ]).then(([top, sum]) => {
      setTopProducts(top)
      setSummary(sum)
    }).finally(() => setLoading(false))
  }, [])

  async function handleExportExcel() {
    setExporting(true)
    try {
      const { data } = await movementsService.getAll({ page: 1 })
      exportToExcel(data)
      toast.success('Reporte exportado a Excel')
    } catch { toast.error('Error al exportar') }
    finally { setExporting(false) }
  }

  async function handleExportPDF() {
    setExporting(true)
    try {
      const { data } = await movementsService.getAll({ page: 1 })
      exportToPDF(data, topProducts)
      toast.success('Reporte exportado a PDF')
    } catch { toast.error('Error al exportar') }
    finally { setExporting(false) }
  }

  if (loading) return <div className="flex justify-center mt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Reportes</h1>
          <p className="text-gray-400 text-sm">Análisis y exportación de datos</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportExcel} disabled={exporting} className="btn-secondary">
            <FileSpreadsheet size={15} className="text-emerald-400" /> Exportar Excel
          </button>
          <button onClick={handleExportPDF} disabled={exporting} className="btn-secondary">
            <FileText size={15} className="text-red-400" /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Resumen entradas vs salidas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Entradas</p>
          <p className="text-3xl font-bold text-emerald-400">{summary.entrada?.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">unidades ingresadas</p>
        </div>
        <div className="card p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Salidas</p>
          <p className="text-3xl font-bold text-red-400">{summary.salida?.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">unidades despachadas</p>
        </div>
      </div>

      {/* Top productos */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-white mb-4">Productos más despachados</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#7a8099', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" width={160} tick={{ fill: '#e8eaf0', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#1e2635', border: '1px solid #2a3347', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#e8eaf0' }}
            />
            <Bar dataKey="total" fill="#4f7cff" radius={[0, 4, 4, 0]} name="Unidades despachadas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
