import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from './api'
import { ClientsPanel } from './components/ClientsPanel'
import { InvoicesPanel } from './components/InvoicesPanel'
import { LoginPage } from './components/LoginPage'
import { OverviewPanel } from './components/OverviewPanel'
import type {
  Client,
  CreateClientInput,
  InvoiceAction,
  InvoiceRecord,
  InvoiceStatus,
  InvoiceUpdatePayload,
  SessionUser,
  ToastState,
  WorkspaceView,
} from './types'
import { filterInvoices, formatCurrency, getInvoiceStatusLabel, roleLabel } from './utils'

const workspaceTabs: Array<{ id: WorkspaceView; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'clients', label: 'Clientes' },
  { id: 'invoices', label: 'Facturas' },
]

function App() {
  const [session, setSession] = useState<SessionUser | null>(null)
  const [activeView, setActiveView] = useState<WorkspaceView>('overview')
  const [clients, setClients] = useState<Client[]>([])
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [visibleInvoices, setVisibleInvoices] = useState<InvoiceRecord[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null)
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'ALL'>('ALL')
  const [toast, setToast] = useState<ToastState | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(false)
  const [isBusy, setIsBusy] = useState(false)

  useEffect(() => {
    if (!toast) {
      return undefined
    }

    const timeout = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const loadWorkspace = useCallback(async (selectedId?: string) => {
    setIsBootstrapping(true)

    try {
      const [nextClients, nextInvoices] = await Promise.all([api.getClients(), api.getInvoices()])

      setClients(nextClients)
      setInvoices(nextInvoices)
      setVisibleInvoices(filterInvoices(nextInvoices, statusFilter))

      const invoiceToFocus =
        nextInvoices.find((invoice) => invoice.id === selectedId) ?? nextInvoices[0] ?? null
      setSelectedInvoice(invoiceToFocus)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible cargar la data'
      setToast({ tone: 'error', message })
    } finally {
      setIsBootstrapping(false)
    }
  }, [statusFilter])

  useEffect(() => {
    if (!session) {
      return
    }

    void loadWorkspace()
  }, [loadWorkspace, session])

  async function handleLogin(email: string, password: string) {
    setIsBusy(true)

    try {
      const nextSession = await api.login({ email, password })
      setSession(nextSession)
      setToast({ tone: 'success', message: `Sesion iniciada como ${roleLabel[nextSession.role]}` })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Credenciales invalidas'
      setToast({ tone: 'error', message })
    } finally {
      setIsBusy(false)
    }
  }

  async function handleCreateClient(payload: CreateClientInput) {
    setIsBusy(true)

    try {
      const nextClient = await api.createClient(payload)
      const nextClients = [nextClient, ...clients]
      setClients(nextClients)
      setToast({
        tone: 'success',
        message: `Cliente creado: ${nextClient.fullName} (${nextClient.email})`,
      })
      setActiveView('clients')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible crear el cliente'
      setToast({ tone: 'error', message })
    } finally {
      setIsBusy(false)
    }
  }

  async function handleInvoiceAction(action: InvoiceAction, payload?: InvoiceUpdatePayload) {
    if (!selectedInvoice) {
      return
    }

    setIsBusy(true)

    try {
      const updatedInvoice = await api.runInvoiceAction(selectedInvoice.id, action, payload)

      setInvoices((currentInvoices) =>
        currentInvoices.map((invoice) =>
          invoice.id === updatedInvoice.id ? updatedInvoice : invoice,
        ),
      )
      setSelectedInvoice(updatedInvoice)

      const verb =
        action === 'save'
          ? 'Factura actualizada'
          : action === 'pay'
            ? 'Factura pagada'
            : action === 'freeze'
              ? 'Factura congelada'
              : action === 'unfreeze'
                ? 'Factura descongelada'
                : 'Factura cancelada'

      setToast({
        tone: 'success',
        message: `${verb}: ${updatedInvoice.contractCode} (${getInvoiceStatusLabel(updatedInvoice.status)})`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible ejecutar la accion'
      setToast({ tone: 'error', message })
    } finally {
      setIsBusy(false)
    }
  }

  async function handleResetDemoData() {
    setIsBusy(true)

    try {
      await api.resetDemoData()
      await loadWorkspace(selectedInvoice?.id)
      setToast({ tone: 'success', message: 'Estado demo restaurado' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible resetear la data demo'
      setToast({ tone: 'error', message })
    } finally {
      setIsBusy(false)
    }
  }

  const counts = useMemo(() => {
    return {
      clients: clients.length,
      invoices: invoices.length,
      pending: invoices.filter((invoice) => invoice.status === 'PENDING').length,
      frozen: invoices.filter((invoice) => invoice.status === 'FROZEN').length,
      exposure: invoices.reduce((total, invoice) => total + invoice.totalAmount, 0),
    }
  }, [clients, invoices])

  function handleFilterChange(nextStatus: InvoiceStatus | 'ALL') {
    const filteredInvoices = filterInvoices(invoices, nextStatus)
    setStatusFilter(nextStatus)
    setVisibleInvoices(filteredInvoices)

    if (!selectedInvoice || !filteredInvoices.some((invoice) => invoice.id === selectedInvoice.id)) {
      setSelectedInvoice(filteredInvoices[0] ?? null)
    }
  }

  if (!session) {
    return <LoginPage isBusy={isBusy} onSubmit={handleLogin} toast={toast} />
  }

  return (
    <div className="shell">
      <header className="shell-header">
        <div>
          <p className="eyebrow">Prueba tecnica QA hibrido</p>
          <h1>Mesa de operaciones Leasy</h1>
          <p className="header-copy">
            Flujo demo de clientes y facturas para detectar riesgos de permisos, reglas
            de negocio y sincronizacion UI/API.
          </p>
        </div>

        <div className="header-meta">
          <div className="meta-block">
            <span className="meta-label">Usuario</span>
            <strong>{session.name}</strong>
            <span>{roleLabel[session.role]}</span>
          </div>

          <div className="meta-block">
            <span className="meta-label">Cobertura visible</span>
            <strong>{counts.clients} clientes</strong>
            <span>{counts.invoices} facturas</span>
          </div>

          <button
            className="secondary-button"
            type="button"
            onClick={() => void handleResetDemoData()}
            disabled={isBusy}
            data-testid="reset-demo-data"
          >
            Reset demo data
          </button>
        </div>
      </header>

      <nav className="shell-tabs" aria-label="Secciones">
        {workspaceTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={tab.id === activeView ? 'tab-button is-active' : 'tab-button'}
            onClick={() => setActiveView(tab.id)}
            data-testid={`nav-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="shell-content">
        {activeView === 'overview' && (
          <OverviewPanel
            counts={counts}
            exposureLabel={formatCurrency(counts.exposure)}
            sessionRoleLabel={roleLabel[session.role]}
          />
        )}

        {activeView === 'clients' && (
          <ClientsPanel
            clients={clients}
            isBusy={isBusy}
            onCreateClient={handleCreateClient}
          />
        )}

        {activeView === 'invoices' && (
          <InvoicesPanel
            key={selectedInvoice?.id ?? 'empty'}
            isBootstrapping={isBootstrapping}
            isBusy={isBusy}
            invoices={visibleInvoices}
            selectedInvoice={selectedInvoice}
            statusFilter={statusFilter}
            onAction={handleInvoiceAction}
            onFilterChange={handleFilterChange}
            onRefresh={() => void loadWorkspace(selectedInvoice?.id)}
            onSelectInvoice={setSelectedInvoice}
          />
        )}
      </main>

      {toast && (
        <div
          className={toast.tone === 'error' ? 'toast is-error' : 'toast is-success'}
          role="status"
          data-testid="global-toast"
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default App
