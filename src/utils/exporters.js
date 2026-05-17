import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function exportToExcel(movements) {
  const rows = movements.map(m => ({
    'Tipo':         m.type,
    'Producto':     m.products?.name ?? '',
    'SKU':          m.products?.sku ?? '',
    'Cantidad':     m.quantity,
    'Stock Previo': m.previous_stock,
    'Stock Nuevo':  m.new_stock,
    'Usuario':      m.profiles?.full_name ?? '',
    'Nota':         m.note ?? '',
    'Fecha':        format(parseISO(m.created_at), "dd/MM/yyyy HH:mm", { locale: es }),
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Movimientos')

  // Auto column widths
  const cols = Object.keys(rows[0] || {}).map(k => ({ wch: Math.max(k.length, 14) }))
  ws['!cols'] = cols

  XLSX.writeFile(wb, `StockGT_Movimientos_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
}

export function exportToPDF(movements, topProducts = []) {
  const doc = new jsPDF({ orientation: 'landscape' })

  // Header
  doc.setFillColor(15, 17, 23)
  doc.rect(0, 0, 300, 20, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('StockGT — Reporte de Inventario', 14, 13)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(format(new Date(), "d 'de' MMMM yyyy", { locale: es }), 240, 13)

  // Movimientos
  doc.setTextColor(30, 38, 53)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('Historial de Movimientos', 14, 30)

  autoTable(doc, {
    startY: 34,
    head: [['Tipo', 'Producto', 'Cantidad', 'Stock Previo', 'Stock Nuevo', 'Usuario', 'Fecha']],
    body: movements.map(m => [
      m.type,
      m.products?.name ?? '',
      m.quantity,
      m.previous_stock,
      m.new_stock,
      m.profiles?.full_name ?? '',
      format(parseISO(m.created_at), "dd/MM/yy HH:mm"),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [79, 124, 255], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 255] },
    rowPageBreak: 'auto',
  })

  doc.save(`StockGT_Reporte_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}