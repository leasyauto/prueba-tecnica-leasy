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
    }
  }
}

Cypress.Commands.add('resetDemoState', () => {
  cy.request('POST', '/api/dev/reset')
})

Cypress.Commands.add('loginAs', (role: DemoRole) => {
  cy.visit('/')
  cy.get('[data-testid="login-email"]').clear().type(credentialByRole[role])
  cy.get('[data-testid="login-password"]').clear().type('Leasy2026!')
  cy.get('[data-testid="login-submit"]').click()
  cy.contains('Mesa de operaciones Leasy').should('be.visible')
})

export {}
