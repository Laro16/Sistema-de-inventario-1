import Modal from './Modal'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, danger = true }) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="" size="sm">
      <div className="text-center py-2">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${danger ? 'bg-red-500/15' : 'bg-amber-500/15'}`}>
          <AlertTriangle size={24} className={danger ? 'text-red-400' : 'text-amber-400'} />
        </div>
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onClose} className="btn-secondary px-6">Cancelar</button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`btn-primary px-6 ${danger ? 'bg-red-500 hover:bg-red-600' : ''}`}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Confirmar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}