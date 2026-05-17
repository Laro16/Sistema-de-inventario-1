import { supabase } from '@/lib/supabase'

const PER_PAGE = 25

export const movementsService = {
  async getAll({ page = 1, productId = '', type = '', from = '', to = '' } = {}) {
    let query = supabase
      .from('inventory_movements')
      .select(`
        *,
        products(id, name, sku),
        profiles!inventory_movements_user_id_fkey(id, full_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1)

    if (productId) query = query.eq('product_id', productId)
    if (type)      query = query.eq('type', type)
    if (from)      query = query.gte('created_at', from)
    if (to)        query = query.lte('created_at', to + 'T23:59:59')

    const { data, error, count } = await query
    if (error) throw error
    return { data, count, totalPages: Math.ceil((count ?? 0) / PER_PAGE) }
  },

  async create({ productId, type, quantity, note, userId }) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .insert({
        product_id: productId,
        type,
        quantity,
        note: note || null,
        user_id: userId,
        previous_stock: 0, // será sobreescrito por el trigger
        new_stock: 0,
      })
      .select(`
        *,
        products(id, name, sku),
        profiles!inventory_movements_user_id_fkey(id, full_name)
      `)
      .single()
    if (error) throw error
    return data
  },

  async getRecent(limit = 10) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select(`
        *,
        products(id, name, sku),
        profiles!inventory_movements_user_id_fkey(id, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data
  },

  async getSummary() {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select('type, quantity')
    if (error) throw error
    const totals = data.reduce(
      (acc, m) => {
        acc[m.type] = (acc[m.type] || 0) + m.quantity
        return acc
      },
      { entrada: 0, salida: 0 }
    )
    return totals
  },
}