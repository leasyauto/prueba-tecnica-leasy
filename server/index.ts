import cors from 'cors'
import express from 'express'
import { getState, resetState } from './state'
import type { Client, Invoice, User } from './types'

const app = express()
const port = 8787

app.use(cors())
app.use(express.json())

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function withoutPassword(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    team: user.team,
  }
}

function serializeInvoice(invoice: Invoice) {
  const state = getState()
  const client = state.clients.find((item) => item.id === invoice.clientId)

  return {
    ...invoice,
    clientName: client?.fullName ?? 'Cliente no encontrado',
    clientEmail: client?.email ?? 'n/a',
  }
}

function recalculateTotals(invoice: Invoice) {
  invoice.totalAmount = Number((invoice.baseAmount - invoice.couponAmount).toFixed(2))
  invoice.updatedAt = new Date().toISOString()
}

function findInvoice(id: string) {
  return getState().invoices.find((invoice) => invoice.id === id)
}

function getRoleFromRequest() {
  return ((app.get('activeRole') as string | undefined) ?? 'ops') as 'admin' | 'ops' | 'viewer'
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true })
})

app.post('/api/session/login', async (request, response) => {
  await sleep(250)
  const { email, password } = request.body as { email?: string; password?: string }
  const state = getState()
  const user = state.users.find(
    (candidate) => candidate.email === email && candidate.password === password,
  )

  if (!user) {
    response.status(401).json({ message: 'Credenciales invalidas' })
    return
  }

  app.set('activeRole', user.role)
  response.json(withoutPassword(user))
})

app.get('/api/clients', async (_request, response) => {
  await sleep(180)
  const clients = [...getState().clients].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  )
  response.json(clients)
})

app.post('/api/clients', async (request, response) => {
  await sleep(220)
  const { fullName, email, document, city, segment } = request.body as Partial<Client>

  if (!fullName || !email || !document || !city || !segment) {
    response.status(400).json({ message: 'Todos los campos del cliente son obligatorios' })
    return
  }

  const state = getState()
  const duplicatedEmail = state.clients.find((client) => client.email === email.trim())

  if (duplicatedEmail) {
    response.status(409).json({ message: 'Ya existe un cliente con ese email' })
    return
  }

  const nextClient: Client = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: email.trim(),
    document: document.trim(),
    city,
    segment,
    risk: 'LOW',
    createdAt: new Date().toISOString(),
  }

  state.clients.unshift(nextClient)
  response.status(201).json(nextClient)
})

app.get('/api/invoices', async (_request, response) => {
  await sleep(260)
  response.json(getState().invoices.map(serializeInvoice))
})

app.patch('/api/invoices/:invoiceId', async (request, response) => {
  await sleep(280)
  const invoice = findInvoice(request.params.invoiceId)
  const { couponCode, couponAmount, notes } = request.body as Partial<Invoice>

  if (!invoice) {
    response.status(404).json({ message: 'Factura no encontrada' })
    return
  }

  invoice.couponCode = couponCode?.trim() ?? invoice.couponCode
  invoice.couponAmount = Number(couponAmount ?? invoice.couponAmount)
  invoice.notes = notes?.trim() ?? invoice.notes
  recalculateTotals(invoice)

  response.json(serializeInvoice(invoice))
})

app.post('/api/invoices/:invoiceId/pay', async (request, response) => {
  await sleep(220)
  const invoice = findInvoice(request.params.invoiceId)

  if (!invoice) {
    response.status(404).json({ message: 'Factura no encontrada' })
    return
  }

  if (invoice.status === 'FROZEN') {
    response.status(409).json({ message: 'No se puede pagar una factura congelada' })
    return
  }

  if (invoice.status === 'CANCELLED') {
    response.status(409).json({ message: 'No se puede pagar una factura cancelada' })
    return
  }

  invoice.status = 'PAID'
  invoice.updatedAt = new Date().toISOString()
  response.json(serializeInvoice(invoice))
})

app.post('/api/invoices/:invoiceId/freeze', async (request, response) => {
  await sleep(220)
  const invoice = findInvoice(request.params.invoiceId)

  if (!invoice) {
    response.status(404).json({ message: 'Factura no encontrada' })
    return
  }

  if (!['PENDING', 'DRAFT'].includes(invoice.status)) {
    response.status(409).json({ message: 'Solo puedes congelar facturas draft o pending' })
    return
  }

  invoice.status = 'FROZEN'
  invoice.updatedAt = new Date().toISOString()
  response.json(serializeInvoice(invoice))
})

app.post('/api/invoices/:invoiceId/unfreeze', async (request, response) => {
  await sleep(220)
  const invoice = findInvoice(request.params.invoiceId)

  if (!invoice) {
    response.status(404).json({ message: 'Factura no encontrada' })
    return
  }

  if (invoice.status !== 'FROZEN') {
    response.status(409).json({ message: 'Solo puedes descongelar facturas frozen' })
    return
  }

  invoice.status = 'PENDING'
  invoice.updatedAt = new Date().toISOString()
  response.json(serializeInvoice(invoice))
})

app.post('/api/invoices/:invoiceId/cancel', async (request, response) => {
  await sleep(220)
  const invoice = findInvoice(request.params.invoiceId)
  const role = getRoleFromRequest()

  if (!invoice) {
    response.status(404).json({ message: 'Factura no encontrada' })
    return
  }

  if (invoice.status === 'PAID') {
    response.status(409).json({ message: 'No se puede cancelar una factura pagada' })
    return
  }

  if (!['admin', 'ops', 'viewer'].includes(role)) {
    response.status(403).json({ message: 'Rol no autorizado para cancelar' })
    return
  }

  invoice.status = 'CANCELLED'
  invoice.updatedAt = new Date().toISOString()
  response.json(serializeInvoice(invoice))
})

app.post('/api/dev/reset', async (_request, response) => {
  await sleep(120)
  resetState()
  app.set('activeRole', 'ops')
  response.json({ ok: true })
})

app.listen(port, () => {
  console.log(`QA challenge API running on http://127.0.0.1:${port}`)
})
