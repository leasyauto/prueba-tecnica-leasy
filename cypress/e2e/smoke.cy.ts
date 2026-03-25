describe('qa challenge smoke', () => {
  beforeEach(() => {
    cy.resetDemoState()
  })

  it('shows the login page with demo credentials', () => {
    cy.visit('/')
    cy.contains('Prueba tecnica QA hibrido').should('be.visible')
    cy.contains('admin@leasy.pe').should('be.visible')
    cy.get('[data-testid="login-submit"]').should('be.visible')
  })
})
