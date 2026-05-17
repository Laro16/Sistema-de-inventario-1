import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1
    if (page <= 3) return i + 1
    if (page >= totalPages - 2) return totalPages - 4 + i
    return page - 2 + i
  })

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg hover:bg-dark-700 disabled:opacity-30 text-gray-400"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
            p === page
              ? 'bg-primary-500 text-white'
              : 'text-gray-400 hover:bg-dark-700 hover:text-white'
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-1.5 rounded-lg hover:bg-dark-700 disabled:opacity-30 text-gray-400"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}