describe('auth', () => {
  beforeEach(() => {
    cy.resetDemoState()
  })

  ;(['admin', 'ops', 'viewer'] as const).forEach((role) => {
    it(`puedo iniciar sesión como ${role}`, () => {
      cy.loginAs(role)
      cy.get('[data-testid="nav-overview"]').should('be.visible')
    })
  })
})
