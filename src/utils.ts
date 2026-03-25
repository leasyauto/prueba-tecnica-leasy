import type { InvoiceRecord, InvoiceStatus, UserRole } from './types'

export const roleLabel: Record<UserRole, string> = {
  admin: 'Admin de operaciones',
  ops: 'Analista de operaciones',
  viewer: 'Auditoria',
}

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  PAID: 'Paid',
  FROZEN: 'Frozen',
  CANCELLED: 'Cancelled',
}

export function getInvoiceStatusLabel(status: InvoiceStatus) {
  return invoiceStatusLabel[status]
}

export function getStatusClass(status: InvoiceStatus) {
  return `status-chip status-${status.toLowerCase()}`
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function filterInvoices(
  invoices: InvoiceRecord[],
  status: InvoiceStatus | 'ALL',
) {
  if (status === 'ALL') {
    return invoices
  }

  return invoices.filter((invoice) => invoice.status === status)
}
