import { useState, useEffect, useCallback } from 'react'
import { productsService } from '@/services/products.service'
import toast from 'react-hot-toast'

export function useProducts(initialFilters = {}) {
  const [products,    setProducts]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [totalCount,  setTotalCount]  = useState(0)
  const [filters,     setFilters]     = useState(initialFilters)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, count, totalPages: tp } = await productsService.getAll({ page, ...filters })
      setProducts(data ?? [])
      setTotalCount(count ?? 0)
      setTotalPages(tp)
    } catch {
      toast.error('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { load() }, [load])

  const updateFilters = (newFilters) => {
    setPage(1)
    setFilters(f => ({ ...f, ...newFilters }))
  }

  return { products, loading, page, totalPages, totalCount, setPage, filters, updateFilters, refresh: load }
}
