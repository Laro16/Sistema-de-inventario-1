import { useEffect, useState } from 'react'
import { Package, TrendingDown, AlertTriangle, XCircle, ArrowLeftRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { dashboardService } from '@/services/dashboard.service'
import { movementsService  } from '@/services/movements.service'
import Spinner from '@/components/ui/Spinner'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const STAT_CARDS = [
  { key: 'total_products',  label: 'Total Productos', icon: Package,       color: 'text-primary-400',  bg: 'bg-primary-500/10'  },
  { key: 'inventory_value', label: 'Valor Inventario', icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-500/10', prefix: 'Q', format: 'currency' },
  { key: 'low_stock',       label: 'Stock Bajo',       icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10'  },
  { key: 'out_of_stock',    label: 'Agotados',          icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-500/10'    },
]

export default function Dashboard() {
  const [stats,     setStats]     = useState(null)
  const [chartData, setChartData] = useState([])
  const [recent,    setRecent]    = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getMovementsByDay(14),
      movementsService.getRecent(8),
    ]).then(([s, chart, mov]) => {
      setStats(s)
      setChartData(chart.map(d => ({ ...d, date: format(parseISO(d.date), 'd MMM', { locale: es }) })))
      setRecent(mov)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center mt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm">Resumen general de tu inventario</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg, prefix, format: fmt }) => (
          <div key={key} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <div className={`${bg} p-2 rounded-lg`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color}`}>
              {prefix ?? ''}{fmt === 'currency'
                ? Number(stats?.[key] ?? 0).toLocaleString('es-GT', { minimumFractionDigits: 0 })
                : (stats?.[key] ?? 0)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gráfico de movimientos */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-4">Movimientos últimos 14 días</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gradE" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c896" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00c896" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff5c7c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff5c7c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" />
              <XAxis dataKey="date" tick={{ fill: '#7a8099', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7a8099', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e2635', border: '1px solid #2a3347', borderRadius: 10, fontSize: 12 }}
                labelStyle={{ color: '#e8eaf0' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#7a8099' }} />
              <Area type="monotone" dataKey="entradas" stroke="#00c896" strokeWidth={2} fill="url(#gradE)" name="Entradas" />
              <Area type="monotone" dataKey="salidas"  stroke="#ff5c7c" strokeWidth={2} fill="url(#gradS)" name="Salidas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Últimos movimientos */}
        <div className="card">
          <div className="p-4 border-b border-dark-600 flex items-center gap-2">
            <ArrowLeftRight size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-white">Últimos movimientos</h2>
          </div>
          <div className="divide-y divide-dark-600">
            {recent.map(m => (
              <div key={m.id} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${m.type === 'entrada' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  {m.type === 'entrada' ? '+' : '-'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{m.products?.name}</p>
                  <p className="text-[10px] text-gray-500">{m.profiles?.full_name}</p>
                </div>
                <span className={`text-xs font-bold ${m.type === 'entrada' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}