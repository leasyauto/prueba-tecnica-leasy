import type {
  Client,
  CreateClientInput,
  InvoiceAction,
  InvoiceRecord,
  InvoiceUpdatePayload,
  LoginPayload,
  SessionUser,
} from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? 'Request failed')
  }

  return (await response.json()) as T
}

export const api = {
  login(payload: LoginPayload) {
    return request<SessionUser>('/api/session/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getClients() {
    return request<Client[]>('/api/clients')
  },

  createClient(payload: CreateClientInput) {
    return request<Client>('/api/clients', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  getInvoices() {
    return request<InvoiceRecord[]>('/api/invoices')
  },

  runInvoiceAction(id: string, action: InvoiceAction, payload?: InvoiceUpdatePayload) {
    if (action === 'save') {
      return request<InvoiceRecord>(`/api/invoices/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    }

    return request<InvoiceRecord>(`/api/invoices/${id}/${action}`, {
      method: 'POST',
    })
  },

  resetDemoData() {
    return request<{ ok: true }>('/api/dev/reset', {
      method: 'POST',
    })
  },
}
