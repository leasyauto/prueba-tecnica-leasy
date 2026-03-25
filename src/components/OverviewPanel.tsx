interface OverviewPanelProps {
  counts: {
    clients: number
    invoices: number
    pending: number
    frozen: number
    exposure: number
  }
  exposureLabel: string
  sessionRoleLabel: string
}

const releaseNotes = [
  'March 20, 2026: se habilito cupon por monto fijo para facturas.',
  'March 22, 2026: el listado de facturas dejo de recargar toda la tabla luego de cada accion.',
  'March 24, 2026: se simplifico la matriz de permisos del modulo de facturas.',
]

const businessFocus = [
  'El email del cliente debe ser unico sin importar mayusculas o minusculas.',
  'Solo admin puede cancelar facturas.',
  'Una factura cancelada no debe aceptar edicion.',
  'El total de la factura debe quedar mayor a cero despues del cupon.',
  'Una factura congelada no puede pagarse hasta ser descongelada.',
]

const qaSignals = [
  'Pruebas de permisos entre ops y admin.',
  'Casos limite de cupon y totales negativos.',
  'Consistencia entre detalle de factura, lista y filtro por estado.',
  'Cobertura de mensajes de error y persistencia de datos.',
]

export function OverviewPanel({
  counts,
  exposureLabel,
  sessionRoleLabel,
}: OverviewPanelProps) {
  return (
    <div className="panel-grid overview-grid">
      <section className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Contexto</p>
            <h2 className="section-title">Panorama del workspace</h2>
            <p className="section-copy">
              El rol actual visible es <strong>{sessionRoleLabel}</strong>. La app refleja un
              flujo de operacion diaria con clientes y facturas activas.
            </p>
          </div>
        </div>

        <div className="overview-stats">
          <article className="stat-card">
            <span className="meta-note">Clientes</span>
            <strong>{counts.clients}</strong>
          </article>
          <article className="stat-card">
            <span className="meta-note">Facturas</span>
            <strong>{counts.invoices}</strong>
          </article>
          <article className="stat-card">
            <span className="meta-note">Pendientes</span>
            <strong>{counts.pending}</strong>
          </article>
          <article className="stat-card">
            <span className="meta-note">Congeladas</span>
            <strong>{counts.frozen}</strong>
          </article>
        </div>

        <div className="helper-grid" style={{ marginTop: 18 }}>
          <article className="helper-card">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>
              Areas donde suele romperse
            </h3>
            <ul className="bullet-list">
              {qaSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="helper-card">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>
              Exposicion abierta
            </h3>
            <p className="section-copy">Monto total visible en la cartera actual.</p>
            <strong style={{ display: 'block', fontSize: '1.8rem', color: 'var(--brand)', marginTop: 10 }}>
              {exposureLabel}
            </strong>
          </article>
        </div>
      </section>

      <aside className="panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Brief</p>
            <h2 className="section-title">Cambios recientes y reglas</h2>
          </div>
        </div>

        <div className="panel-grid">
          <article className="helper-card">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>
              Release notes
            </h3>
            <ul className="rule-list">
              {releaseNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="helper-card">
            <h3 className="section-title" style={{ fontSize: '1rem' }}>
              Reglas de negocio
            </h3>
            <ul className="rule-list">
              {businessFocus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </aside>
    </div>
  )
}
