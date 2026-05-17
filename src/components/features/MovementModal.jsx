import { useEffect, useState } from 'react'
import { useForm }           from 'react-hook-form'
import { zodResolver }       from '@hookform/resolvers/zod'
import { z }                 from 'zod'
import { Loader2 }           from 'lucide-react'
import Modal                 from '@/components/ui/Modal'
import { supabase }          from '@/lib/supabase'

const schema = z.object({
  productId: z.string().uuid('Selecciona un producto'),
  type:      z.enum(['entrada', 'salida']),
  quantity:  z.coerce.number().int().min(1, 'Cantidad mínima es 1'),
  note:      z.string().optional(),
})

export default function MovementModal({ open, onClose, onSubmit }) {
  const [products, setProducts] = useState([])
  const [saving,   setSaving]   = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'entrada' },
  })

  useEffect(() => {
    if (!open) return
    supabase.from('products').select('id,name,sku,stock').eq('active', true).order('name')
      .then(({ data }) => setProducts(data ?? []))
    reset({ type: 'entrada' })
  }, [open, reset])

  async function handleSave(values) {
    setSaving(true)
    try { await onSubmit(values) }
    finally { setSaving(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar movimiento">
      <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
        <div>
          <label className="label">Tipo de movimiento</label>
          <div className="grid grid-cols-2 gap-3">
            {['entrada', 'salida'].map(t => (
              <label key={t} className="relative cursor-pointer">
                <input {...register('type')} type="radio" value={t} className="peer hidden" />
                <div className={`p-3 rounded-xl border text-center text-sm font-semibold transition-all peer-checked:border-primary-500 peer-checked:bg-primary-500/10 peer-checked:text-primary-400 border-dark-500 text-gray-400 hover:border-dark-400`}>
                  {t === 'entrada' ? '📥 Entrada' : '📤 Salida'}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Producto</label>
          <select {...register('productId')} className="input-field">
            <option value="">Seleccionar producto...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} {p.sku ? `(${p.sku})` : ''} — Stock: {p.stock}
              </option>
            ))}
          </select>
          {errors.productId && <p className="text-red-400 text-xs mt-1">{errors.productId.message}</p>}
        </div>

        <div>
          <label className="label">Cantidad</label>
          <input {...register('quantity')} type="number" min="1" className="input-field" placeholder="0" />
          {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
        </div>

        <div>
          <label className="label">Nota (opcional)</label>
          <textarea {...register('note')} rows={2} className="input-field resize-none" placeholder="Motivo del movimiento..." />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><Loader2 size={14} className="animate-spin" />Guardando...</> : 'Registrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
