import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/ui/Modal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Spinner from '@/components/ui/Spinner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color inválido'),
})

const PRESET_COLORS = [
  '#4f7cff', '#00c896', '#f59e0b', '#06b6d4', '#8b5cf6', 
  '#ec4899', '#10b981', '#f97316', '#ef4444', '#6b7280'
]

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDel, setShowDel] = useState(false)
  const [selected, setSelected] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { color: '#4f7cff' }
  })

  const selectedColor = watch('color')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    setCategories(data ?? [])
    setLoading(false)
  }

  function openCreate() {
    setSelected(null)
    reset({ name: '', description: '', color: '#4f7cff' })
    setShowForm(true)
  }

  function openEdit(cat) {
    setSelected(cat)
    reset(cat)
    setShowForm(true)
  }

  function openDelete(cat) {
    setToDelete(cat)
    setShowDel(true)
  }

  async function onSubmit(values) {
    try {
      if (selected) {
        await supabase.from('categories').update(values).eq('id', selected.id)
        toast.success('Categoría actualizada')
      } else {
        await supabase.from('categories').insert(values)
        toast.success('Categoría creada')
      }
      setShowForm(false)
      load()
    } catch (e) {
      toast.error(e.message ?? 'Error al guardar')
    }
  }

  async function handleDelete() {
    await supabase.from('categories').delete().eq('id', toDelete.id)
    toast.success('Categoría eliminada')
    setShowDel(false)
    load()
  }

  if (loading) return <div className="flex justify-center mt-20"><Spinner size="lg" /></div>

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Categorías</h1>
          <p className="text-gray-400 text-sm">Organiza tus productos por categorías</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: cat.color + '20' }}
              >
                <Tag size={18} style={{ color: cat.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white">{cat.name}</h3>
                {cat.description && (
                  <p className="text-xs text-gray-400 mt-1">{cat.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-white"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => openDelete(cat)}
                  className="p-1.5 rounded-lg hover:bg-red-500/15 text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de formulario */}
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={selected ? 'Editar categoría' : 'Nueva categoría'}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input
              {...register('name')}
              placeholder="Ej: Construcción"
              className="input-field"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Descripción (opcional)</label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Descripción de la categoría..."
              className="input-field resize-none"
            />
          </div>

          <div>
            <label className="label">Color</label>
            <div className="flex gap-2 mb-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className="w-8 h-8 rounded-lg border-2 transition-all"
                  style={{
                    background: color,
                    borderColor: selectedColor === color ? '#fff' : 'transparent',
                    transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)'
                  }}
                />
              ))}
            </div>
            <input
              {...register('color')}
              type="color"
              className="w-full h-10 rounded-lg border border-dark-600 bg-dark-700 cursor-pointer"
            />
            {errors.color && <p className="text-red-400 text-xs mt-1">{errors.color.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={showDel}
        onClose={() => setShowDel(false)}
        onConfirm={handleDelete}
        title="¿Eliminar categoría?"
        message={`¿Seguro que deseas eliminar "${toDelete?.name}"? Los productos de esta categoría quedarán sin categoría.`}
      />
    </div>
  )
}
