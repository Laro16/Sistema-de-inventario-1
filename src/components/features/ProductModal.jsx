import { useEffect, useState } from 'react'
import { useForm }           from 'react-hook-form'
import { zodResolver }       from '@hookform/resolvers/zod'
import { z }                 from 'zod'
import { Upload, X, Loader2 } from 'lucide-react'
import Modal                 from '@/components/ui/Modal'
import { productsService }   from '@/services/products.service'
import { supabase }          from '@/lib/supabase'
import { useAuth }           from '@/store/AuthContext'
import toast                 from 'react-hot-toast'

const schema = z.object({
  name:           z.string().min(2, 'Nombre requerido'),
  sku:            z.string().optional(),
  description:    z.string().optional(),
  category_id:    z.string().optional(),
  purchase_price: z.coerce.number().min(0),
  sale_price:     z.coerce.number().min(0),
  stock:          z.coerce.number().int().min(0),
  min_stock:      z.coerce.number().int().min(0),
  unit:           z.string().default('unidad'),
})

export default function ProductModal({ open, onClose, product, onSaved }) {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [imageFile,  setImageFile]  = useState(null)
  const [imagePreview, setPreview]  = useState(null)
  const [saving, setSaving]         = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    supabase.from('categories').select('id,name,color').then(({ data }) => setCategories(data ?? []))
  }, [])

  useEffect(() => {
    if (product) {
      reset(product)
      setPreview(product.image_url)
    } else {
      reset({ stock: 0, min_stock: 5, purchase_price: 0, sale_price: 0, unit: 'unidad' })
      setPreview(null)
    }
    setImageFile(null)
  }, [product, reset, open])

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function onSubmit(values) {
    setSaving(true)
    try {
      let image_url = product?.image_url ?? null
      const saved = product
        ? await productsService.update(product.id, { ...values, image_url })
        : await productsService.create({ ...values, image_url, created_by: user.id })

      if (imageFile) {
        image_url = await productsService.uploadImage(imageFile, saved.id)
        await productsService.update(saved.id, { image_url })
      }

      toast.success(product ? 'Producto actualizado' : 'Producto creado')
      onSaved()
    } catch (e) {
      toast.error(e.message ?? 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const F = ({ label, name, type = 'text', ...rest }) => (
    <div>
      <label className="label">{label}</label>
      <input {...register(name)} type={type} className="input-field" {...rest} />
      {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name].message}</p>}
    </div>
  )

  return (
    <Modal open={open} onClose={onClose} title={product ? 'Editar producto' : 'Nuevo producto'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Imagen */}
        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 rounded-xl border-2 border-dashed border-dark-500 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-colors overflow-hidden flex-shrink-0 relative"
            onClick={() => document.getElementById('img-upload').click()}
          >
            {imagePreview
              ? <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              : <Upload size={20} className="text-gray-500" />
            }
            {imagePreview && (
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setPreview(null); setImageFile(null) }}
                className="absolute top-1 right-1 bg-dark-900/80 rounded-full p-0.5"
              >
                <X size={10} className="text-white" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <input id="img-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            <p className="text-xs text-gray-400 mb-2">Imagen del producto (opcional)</p>
            <div className="grid grid-cols-2 gap-3">
              <F label="Nombre *" name="name" placeholder="Ej: Cemento Portland 50lb" />
              <F label="SKU / Código" name="sku" placeholder="Ej: CEM-POR-50" />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Categoría</label>
          <select {...register('category_id')} className="input-field">
            <option value="">Sin categoría</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Descripción</label>
          <textarea {...register('description')} rows={2} placeholder="Descripción opcional..." className="input-field resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <F label="Precio de compra (Q)" name="purchase_price" type="number" step="0.01" />
          <F label="Precio de venta (Q)"  name="sale_price"     type="number" step="0.01" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <F label="Stock actual" name="stock"     type="number" />
          <F label="Stock mínimo" name="min_stock" type="number" />
          <div>
            <label className="label">Unidad</label>
            <select {...register('unit')} className="input-field">
              {['unidad','caja','rollo','bolsa','metro','litro','kilo','par','docena','galón'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : 'Guardar producto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}