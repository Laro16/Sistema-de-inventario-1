import { supabase } from '@/lib/supabase'

const PER_PAGE = 20

export const productsService = {
  async getAll({ page = 1, search = '', categoryId = '', onlyActive = true } = {}) {
    let query = supabase
      .from('products')
      .select(`*, categories(id, name, color)`, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PER_PAGE, page * PER_PAGE - 1)

    if (onlyActive) query = query.eq('active', true)
    if (search)     query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
    if (categoryId) query = query.eq('category_id', categoryId)

    const { data, error, count } = await query
    if (error) throw error
    return { data, count, totalPages: Math.ceil((count ?? 0) / PER_PAGE) }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories(id, name, color)`)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async delete(id) {
    // Soft delete
    const { error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', id)
    if (error) throw error
  },

  async uploadImage(file, productId) {
    const ext  = file.name.split('.').pop()
    const path = `${productId}/main.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  },

  async getLowStock() {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories(name, color)`)
      .eq('active', true)
      .lte('stock', supabase.raw('min_stock'))
      .gt('stock', 0)
      .order('stock', { ascending: true })
    if (error) throw error
    return data
  },

  async getOutOfStock() {
    const { data, error } = await supabase
      .from('products')
      .select(`*, categories(name, color)`)
      .eq('active', true)
      .eq('stock', 0)
    if (error) throw error
    return data
  },
}