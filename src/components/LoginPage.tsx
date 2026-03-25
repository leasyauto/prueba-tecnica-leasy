import { useState } from 'react'
import type { ToastState } from '../types'

type DemoRole = 'ops' | 'admin' | 'viewer'

interface LoginPageProps {
  isBusy: boolean
  onSubmit: (email: string, password: string) => Promise<void>
  toast: ToastState | null
}

const demoAccounts: Array<{ role: DemoRole; email: string; label: string }> = [
  { role: 'ops', email: 'ops@leasy.pe', label: 'Analista de operaciones' },
  { role: 'admin', email: 'admin@leasy.pe', label: 'Admin de operaciones' },
  { role: 'viewer', email: 'audit@leasy.pe', label: 'Auditoria' },
]

const sharedPassword = 'Leasy2026!'

export function LoginPage({ isBusy, onSubmit, toast }: LoginPageProps) {
  const [email, setEmail] = useState('ops@leasy.pe')
  const [password, setPassword] = useState(sharedPassword)

  function applyCredential(nextEmail: string) {
    setEmail(nextEmail)
    setPassword(sharedPassword)
  }

  return (
    <div className="login-shell">
      <section className="login-card">
        <div className="login-hero">
          <p className="eyebrow">Challenge</p>
          <h1>Prueba tecnica QA hibrido</h1>
          <p>
            Esta app simula un recorte del trabajo de Leasy: clientes, facturas,
            reglas por rol y cambios recientes con impacto en UI y datos.
          </p>
        </div>

        <div className="panel-grid" style={{ marginTop: 24 }}>
          <div className="helper-card">
            <h2 className="section-title">Que se espera</h2>
            <ul className="bullet-list">
              <li>Exploracion funcional con foco en riesgo de negocio.</li>
              <li>Casos priorizados y bugs bien documentados.</li>
              <li>Automatizacion de escenarios criticos con Cypress.</li>
            </ul>
          </div>

          <div className="helper-card">
            <h2 className="section-title">Areas de interes</h2>
            <ul className="bullet-list">
              <li>Permisos por rol.</li>
              <li>Validaciones de cliente y factura.</li>
              <li>Consistencia entre acciones y filtros.</li>
            </ul>
          </div>
        </div>

        <div className="login-grid" style={{ marginTop: 24 }}>
          {demoAccounts.map((account) => (
            <article className="credential-card" key={account.email}>
              <strong>{account.label}</strong>
              <p>{account.email}</p>
              <p>Clave compartida: {sharedPassword}</p>
              <button
                className="credential-button"
                type="button"
                onClick={() => applyCredential(account.email)}
              >
                Usar este usuario
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside className="login-card">
        <div className="section-header">
          <div>
            <p className="eyebrow">Acceso</p>
            <h2 className="section-title">Iniciar sesion</h2>
            <p className="section-copy">Usa cualquier rol demo para explorar la aplicacion.</p>
          </div>
        </div>

        <form
          className="login-form"
          onSubmit={(event) => {
            event.preventDefault()
            void onSubmit(email, password)
          }}
        >
          <div className="field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              data-testid="login-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="login-password">Clave</label>
            <input
              id="login-password"
              data-testid="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={isBusy}
            data-testid="login-submit"
          >
            {isBusy ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {toast && (
          <div
            className={toast.tone === 'error' ? 'toast is-error' : 'toast is-success'}
            style={{ position: 'static', marginTop: 16 }}
          >
            {toast.message}
          </div>
        )}
      </aside>
    </div>
  )
}
