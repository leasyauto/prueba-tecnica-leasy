import { useState } from 'react'
import type {
  InvoiceAction,
  InvoiceRecord,
  InvoiceStatus,
  InvoiceUpdatePayload,
} from '../types'
import {
  formatCurrency,
  formatDate,
  getInvoiceStatusLabel,
  getStatusClass,
} from '../utils'

interface InvoicesPanelProps {
  isBootstrapping: boolean
  isBusy: boolean
  invoices: InvoiceRecord[]
  selectedInvoice: InvoiceRecord | null
  statusFilter: InvoiceStatus | 'ALL'
  onAction: (action: InvoiceAction, payload?: InvoiceUpdatePayload) => Promise<void>
  onFilterChange: (status: InvoiceStatus | 'ALL') => void
  onRefresh: () => void
  onSelectInvoice: (invoice: InvoiceRecord) => void
}

const statusOptions: Array<InvoiceStatus | 'ALL'> = [
  'ALL',
  'DRAFT',
  'PENDING',
  'PAID',
  'FROZEN',
  'CANCELLED',
]

export function InvoicesPanel({
  isBootstrapping,
  isBusy,
  invoices,
  selectedInvoice,
  statusFilter,
  onAction,
  onFilterChange,
  onRefresh,
  onSelectInvoice,
}: InvoicesPanelProps) {
  const [draft, setDraft] = useState<InvoiceUpdatePayload>({
    couponCode: selectedInvoice?.couponCode ?? '',
    couponAmount: selectedInvoice?.couponAmount ?? 0,
    notes: selectedInvoice?.notes ?? '',
  })

  if (!selectedInvoice) {
    return (
      <section className="panel">
        <div className="empty-state">
          <strong>No hay facturas visibles.</strong>
          <p className="empty-copy" style={{ marginTop: 8 }}>
            Ajusta el filtro o recarga la data demo.
          </p>
        </div>
      </section>
    )
  }

  const expectedTotal = Number((selectedInvoice.baseAmount - draft.couponAmount).toFixed(2))

  return (
    <div className="invoice-layout">
      <section className="panel">
        <div className="invoice-toolbar">
          <div>
            <p className="eyebrow">Facturas</p>
            <h2 className="section-title">Lista operativa</h2>
            <p className="section-copy">
              Cambia estados, valida filtros y contrasta la tabla con el detalle.
            </p>
          </div>

          <div className="button-row">
            <div className="field">
              <label htmlFor="invoice-status-filter">Filtrar por estado</label>
              <select
                id="invoice-status-filter"
                value={statusFilter}
                onChange={(event) => onFilterChange(event.target.value as InvoiceStatus | 'ALL')}
                data-testid="invoice-status-filter"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'ALL' ? 'Todos' : getInvoiceStatusLabel(status)}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={onRefresh}
              data-testid="invoice-refresh"
            >
              Refrescar
            </button>
          </div>
        </div>

        <div className="invoice-list">
          {invoices.map((invoice) => (
            <button
              key={invoice.id}
              type="button"
              className={invoice.id === selectedInvoice.id ? 'list-row is-active' : 'list-row'}
              onClick={() => onSelectInvoice(invoice)}
              data-testid={`invoice-row-${invoice.id}`}
            >
              <div className="list-meta">
                <strong>{invoice.contractCode}</strong>
                <span className={getStatusClass(invoice.status)}>{getInvoiceStatusLabel(invoice.status)}</span>
              </div>
              <small>{invoice.clientName}</small>
              <small>{invoice.clientEmail}</small>
              <small>{formatCurrency(invoice.totalAmount)}</small>
            </button>
          ))}
        </div>

        {isBootstrapping && (
          <p className="helper-copy" style={{ marginTop: 14 }}>
            Recargando data...
          </p>
        )}
      </section>

      <section className="panel">
        <div className="detail-grid">
          <div className="detail-header">
            <div>
              <p className="eyebrow">Detalle</p>
              <h2 className="section-title">{selectedInvoice.contractCode}</h2>
              <p className="detail-note">
                Cliente: {selectedInvoice.clientName} | Vence: {formatDate(selectedInvoice.dueDate)}
              </p>
            </div>

            <span className={getStatusClass(selectedInvoice.status)} data-testid="selected-invoice-status">
              {getInvoiceStatusLabel(selectedInvoice.status)}
            </span>
          </div>

          <div className="totals-grid">
            <article className="total-card">
              <span>Base</span>
              <strong>{formatCurrency(selectedInvoice.baseAmount)}</strong>
            </article>
            <article className="total-card">
              <span>Cupon</span>
              <strong>{formatCurrency(draft.couponAmount * -1)}</strong>
            </article>
            <article className={expectedTotal < 0 ? 'total-card is-negative' : 'total-card'}>
              <span>Total esperado</span>
              <strong data-testid="invoice-total-preview">{formatCurrency(expectedTotal)}</strong>
            </article>
          </div>

          <div className="detail-form">
            <label htmlFor="invoice-coupon-code">Codigo de cupon</label>
            <input
              id="invoice-coupon-code"
              value={draft.couponCode}
              onChange={(event) =>
                setDraft((current) => ({ ...current, couponCode: event.target.value }))
              }
              data-testid="invoice-coupon-code"
            />
          </div>

          <div className="detail-form">
            <label htmlFor="invoice-coupon-amount">Monto del cupon</label>
            <input
              id="invoice-coupon-amount"
              type="number"
              value={draft.couponAmount}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  couponAmount: Number(event.target.value),
                }))
              }
              data-testid="invoice-coupon-amount"
            />
          </div>

          <div className="detail-form">
            <label htmlFor="invoice-notes">Notas operativas</label>
            <textarea
              id="invoice-notes"
              value={draft.notes}
              onChange={(event) =>
                setDraft((current) => ({ ...current, notes: event.target.value }))
              }
              data-testid="invoice-notes"
            />
          </div>

          <div className="button-row">
            <button
              className="primary-button"
              type="button"
              onClick={() => void onAction('save', draft)}
              disabled={isBusy}
              data-testid="invoice-save"
            >
              Guardar cambios
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={() =>
                void onAction(selectedInvoice.status === 'FROZEN' ? 'unfreeze' : 'freeze')
              }
              disabled={isBusy}
              data-testid={
                selectedInvoice.status === 'FROZEN' ? 'invoice-unfreeze' : 'invoice-freeze'
              }
            >
              {selectedInvoice.status === 'FROZEN' ? 'Descongelar' : 'Congelar'}
            </button>

            <button
              className="ghost-button"
              type="button"
              onClick={() => void onAction('pay')}
              disabled={isBusy}
              data-testid="invoice-pay"
            >
              Marcar pagada
            </button>

            <button
              className="danger-button"
              type="button"
              onClick={() => void onAction('cancel')}
              disabled={isBusy}
              data-testid="invoice-cancel"
            >
              Cancelar factura
            </button>
          </div>

          <div className="helper-grid">
            <article className="helper-card">
              <h3 className="section-title" style={{ fontSize: '1rem' }}>
                Meta
              </h3>
              <p className="helper-copy">
                Ultima actualizacion: {formatDate(selectedInvoice.updatedAt)}
              </p>
              <p className="helper-copy">Creada por: {selectedInvoice.createdBy}</p>
            </article>

            <article className="helper-card">
              <h3 className="section-title" style={{ fontSize: '1rem' }}>
                Recordatorio
              </h3>
              <ul className="bullet-list">
                <li>Los cambios deberian reflejarse tambien en la lista.</li>
                <li>Un cupon nunca debe dejar total negativo.</li>
                <li>Revisa comportamiento por rol.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
