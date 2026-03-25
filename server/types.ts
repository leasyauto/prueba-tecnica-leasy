export type UserRole = 'admin' | 'ops' | 'viewer'

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'FROZEN' | 'CANCELLED'

export interface User {
  id: string
  name: string
  email: string
  password: string
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

export interface Invoice {
  id: string
  contractCode: string
  clientId: string
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

export interface SeedState {
  users: User[]
  clients: Client[]
  invoices: Invoice[]
}
