describe('clientes - unicidad de email', () => {
  beforeEach(() => {
    cy.resetDemoState()
    cy.loginAs('ops')
    cy.get('[data-testid="nav-clients"]').click()
    cy.get('[data-testid="client-full-name"]').should('be.visible')
  })

  it('no deja crear cliente con el mismo correo (mayus/minus)', () => {
    const emailBase = 'angeltrabajo@gmai.com'
    const mixedEmail = 'ANGELTRABAJO@GMAI.com'

    // Alta inicial en minúsculas
    cy.intercept('POST', '/api/clients').as('createClient')
    cy.get('[data-testid="client-full-name"]').clear().type('Angel Trabajo')
    cy.get('[data-testid="client-email"]').clear().type(emailBase)
    cy.get('[data-testid="client-document"]').clear().type('55555555')
    cy.get('[data-testid="client-city"]').select('Lima')
    cy.get('[data-testid="client-segment"]').select('Nuevos')
    cy.get('[data-testid="client-submit"]').click()
    cy.wait('@createClient').its('response.statusCode').should('eq', 201)

    // Intento duplicado con mayúsculas mezcladas
    cy.intercept('POST', '/api/clients').as('duplicateClient')
    cy.get('[data-testid="client-full-name"]').clear().type('Angel Trabajo Duplicado')
    cy.get('[data-testid="client-email"]').clear().type(mixedEmail)
    cy.get('[data-testid="client-document"]').clear().type('55555556')
    cy.get('[data-testid="client-city"]').select('Lima')
    cy.get('[data-testid="client-segment"]').select('Nuevos')
    cy.get('[data-testid="client-submit"]').click()
    cy.wait('@duplicateClient').its('response.statusCode').should('eq', 409)
  })
})
