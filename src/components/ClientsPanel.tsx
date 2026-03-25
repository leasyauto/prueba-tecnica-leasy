import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Client, CreateClientInput } from '../types'
import { formatDate } from '../utils'

interface ClientsPanelProps {
  clients: Client[]
  isBusy: boolean
  onCreateClient: (payload: CreateClientInput) => Promise<void>
}

const initialForm: CreateClientInput = {
  fullName: '',
  email: '',
  document: '',
  city: 'Lima',
  segment: 'Nuevos',
}

export function ClientsPanel({ clients, isBusy, onCreateClient }: ClientsPanelProps) {
  const [form, setForm] = useState<CreateClientInput>(initialForm)

  function setField<K extends keyof CreateClientInput>(key: K, value: CreateClientInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onCreateClient(form)
    setForm(initialForm)
  }

  return (
    <div className="clients-layout">
      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Clientes</p>
            <h2 className="section-title">Alta de cliente</h2>
            <p className="section-copy">
              Crea un cliente nuevo para continuar con el flujo comercial.
            </p>
          </div>
        </div>

        <form className="field-grid" onSubmit={(event) => void handleSubmit(event)}>
          <div className="field">
            <label htmlFor="client-full-name">Nombre completo</label>
            <input
              id="client-full-name"
              value={form.fullName}
              onChange={(event) => setField('fullName', event.target.value)}
              data-testid="client-full-name"
            />
          </div>

          <div className="field">
            <label htmlFor="client-email">Email</label>
            <input
              id="client-email"
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
              data-testid="client-email"
            />
            <span className="field-hint">Debe ser unico a nivel negocio.</span>
          </div>

          <div className="field">
            <label htmlFor="client-document">Documento</label>
            <input
              id="client-document"
              value={form.document}
              onChange={(event) => setField('document', event.target.value)}
              data-testid="client-document"
            />
          </div>

          <div className="field">
            <label htmlFor="client-city">Ciudad</label>
            <select
              id="client-city"
              value={form.city}
              onChange={(event) => setField('city', event.target.value)}
              data-testid="client-city"
            >
              <option value="Lima">Lima</option>
              <option value="Arequipa">Arequipa</option>
              <option value="Trujillo">Trujillo</option>
              <option value="Cusco">Cusco</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="client-segment">Segmento</label>
            <select
              id="client-segment"
              value={form.segment}
              onChange={(event) => setField('segment', event.target.value)}
              data-testid="client-segment"
            >
              <option value="Nuevos">Nuevos</option>
              <option value="Renovacion">Renovacion</option>
              <option value="Cobranza">Cobranza</option>
            </select>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={isBusy}
            data-testid="client-submit"
          >
            {isBusy ? 'Guardando...' : 'Crear cliente'}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Clientes</p>
            <h2 className="section-title">Base actual</h2>
            <p className="section-copy">
              Revisa emails, documentos y fechas para detectar duplicados o casos borde.
            </p>
          </div>
        </div>

        <div className="table">
          <div className="table-header">
            <span>Cliente</span>
            <span>Ciudad</span>
            <span>Segmento</span>
            <span>Creado</span>
          </div>

          {clients.map((client) => (
            <div className="table-row" key={client.id} data-testid={`client-row-${client.id}`}>
              <div className="table-cell">
                <strong>{client.fullName}</strong>
                <span>{client.email}</span>
                <span>{client.document}</span>
              </div>
              <div className="table-cell">
                <span>{client.city}</span>
              </div>
              <div className="table-cell">
                <span>{client.segment}</span>
                <span>Risk: {client.risk}</span>
              </div>
              <div className="table-cell">
                <span>{formatDate(client.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
