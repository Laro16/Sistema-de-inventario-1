import { supabase } from '@/lib/supabase'

export const dashboardService = {
  async getStats() {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .single()
    if (error) throw error
    return data
  },

  async getMovementsByDay(days = 14) {
    const from = new Date()
    from.setDate(from.getDate() - days)
    const { data, error } = await supabase
      .from('inventory_movements')
      .select('type, quantity, created_at')
      .gte('created_at', from.toISOString())
      .order('created_at')
    if (error) throw error

    // Agrupar por día
    const map = {}
    data.forEach(m => {
      const day = m.created_at.slice(0, 10)
      if (!map[day]) map[day] = { date: day, entradas: 0, salidas: 0 }
      map[day][m.type === 'entrada' ? 'entradas' : 'salidas'] += m.quantity
    })
    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
  },

  async getTopProducts(limit = 10) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select('product_id, quantity, products(name, sku)')
      .eq('type', 'salida')
    if (error) throw error

    const map = {}
    data.forEach(m => {
      if (!map[m.product_id]) map[m.product_id] = { ...m.products, product_id: m.product_id, total: 0 }
      map[m.product_id].total += m.quantity
    })
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit)
  },
}
