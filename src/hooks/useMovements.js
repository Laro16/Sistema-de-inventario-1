import { useState, useEffect, useCallback } from 'react'
import { movementsService } from '@/services/movements.service'
import toast from 'react-hot-toast'

export function useMovements(initialFilters = {}) {
  const [movements,  setMovements]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [page,       setPage]       = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters,    setFilters]    = useState(initialFilters)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, totalPages: tp } = await movementsService.getAll({ page, ...filters })
      setMovements(data ?? [])
      setTotalPages(tp)
    } catch {
      toast.error('Error al cargar movimientos')
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { load() }, [load] )

  const updateFilters = (f) => { setPage(1); setFilters(x => ({ ...x, ...f })) }

  return { movements, loading, page, totalPages, setPage, filters, updateFilters, refresh: load }
}
