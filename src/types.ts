export type UserRole = 'admin' | 'ops' | 'viewer'

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'FROZEN' | 'CANCELLED'

export type WorkspaceView = 'overview' | 'clients' | 'invoices'

export type InvoiceAction = 'save' | 'pay' | 'freeze' | 'unfreeze' | 'cancel'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
  team: string
}

export interface Client {
  id: string
  fullName: string
  email: string
  document: string
  city: string
  segment: string
  risk: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
}

export interface InvoiceRecord {
  id: string
  contractCode: string
  clientId: string
  clientName: string
  clientEmail: string
  baseAmount: number
  couponCode: string
  couponAmount: number
  totalAmount: number
  status: InvoiceStatus
  notes: string
  dueDate: string
  updatedAt: string
  createdBy: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface CreateClientInput {
  fullName: string
  email: string
  document: string
  city: string
  segment: string
}

export interface InvoiceUpdatePayload {
  couponCode: string
  couponAmount: number
  notes: string
}

export interface ToastState {
  tone: 'success' | 'error'
  message: string
}
