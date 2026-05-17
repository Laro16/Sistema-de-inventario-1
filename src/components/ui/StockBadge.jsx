import clsx from 'clsx'

export default function StockBadge({ stock, minStock }) {
  const isOut  = stock === 0
  const isLow  = stock > 0 && stock <= minStock
  const isOk   = stock > minStock

  return (
    <span className={clsx('badge', {
      'bg-red-500/15 text-red-400':   isOut,
      'bg-amber-500/15 text-amber-400': isLow,
      'bg-emerald-500/15 text-emerald-400': isOk,
    })}>
      {isOut ? 'Agotado' : isLow ? 'Stock bajo' : 'Disponible'}
    </span>
  )
}