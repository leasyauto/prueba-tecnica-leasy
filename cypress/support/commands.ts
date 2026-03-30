/* eslint-disable @typescript-eslint/no-namespace */
type DemoRole = 'admin' | 'ops' | 'viewer'

const credentialByRole: Record<DemoRole, string> = {
  admin: 'admin@leasy.pe',
  ops: 'ops@leasy.pe',
  viewer: 'audit@leasy.pe',
}

declare global {
  namespace Cypress {
    interface Chainable {
      resetDemoState(): Chainable<void>
      loginAs(role: DemoRole): Chainable<void>
      selectInvoice(id: string): Chainable<void>
      applyCoupon(payload: { code?: string; amount?: number }): Chainable<void>
      saveInvoice(): Chainable<void>
      payInvoice(): Chainable<void>
    }
  }
}

Cypress.Commands.add('resetDemoState', () => {
  cy.request('POST', '/api/dev/reset')
})

Cypress.Commands.add('loginAs', (role: DemoRole) => {
  cy.intercept('POST', '/api/session/login').as('login')
  cy.intercept('GET', '/api/clients').as('getClients')
  cy.intercept('GET', '/api/invoices').as('getInvoices')
  cy.visit('/')
  cy.get('[data-testid="login-email"]').clear().type(credentialByRole[role])
  cy.get('[data-testid="login-password"]').clear().type('Leasy2026!')
  cy.get('[data-testid="login-submit"]').click()
  cy.wait('@login').its('response.statusCode').should('eq', 200)
  cy.wait(['@getClients', '@getInvoices'])
  cy.get('@login').its('response.body.role').should('eq', role)
  cy.get('[data-testid="nav-overview"]').should('be.visible')
})

Cypress.Commands.add('selectInvoice', (id: string) => {
  cy.get('[data-testid="nav-invoices"]').click()
  cy.get(`[data-testid="invoice-row-${id}"]`, { timeout: 8000 }).should('exist').click()
  cy.get('[data-testid="selected-invoice-status"]').should('be.visible')
})

Cypress.Commands.add('applyCoupon', ({ code, amount }: { code?: string; amount?: number }) => {
  if (code !== undefined) {
    cy.get('[data-testid="invoice-coupon-code"]').clear().type(code)
  }
  if (amount !== undefined) {
    const value = String(amount)
    cy.get('[data-testid="invoice-coupon-amount"]')
      .focus()
      .type('{selectAll}{backspace}', { force: true })
      .invoke('val', '') // asegura campo vacío sin el 0 por defecto
      .trigger('input')
      .type(value, { force: true, delay: 0 })
      .invoke('val')
      .should('eq', value)
  }
})

Cypress.Commands.add('saveInvoice', () => {
  cy.get('[data-testid="invoice-save"]').click()
})

Cypress.Commands.add('payInvoice', () => {
  cy.get('[data-testid="invoice-pay"]').click()
})

export {}
