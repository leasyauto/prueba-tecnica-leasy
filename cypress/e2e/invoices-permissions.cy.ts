describe('facturas - permisos y visibilidad', () => {
  beforeEach(() => {
    cy.resetDemoState()
  })

  it('ops no debería poder cancelar (debería devolver 403/409)', () => {
    cy.loginAs('ops')
    cy.selectInvoice('inv-001')
    cy.intercept('POST', '/api/invoices/*/cancel').as('cancel')
    cy.get('[data-testid="invoice-cancel"]').click()
    cy.wait('@cancel').its('response.statusCode').should('be.oneOf', [403, 409])
  })

  it('admin puede cancelar (API responde 200)', () => {
    cy.loginAs('admin')
    cy.selectInvoice('inv-001')
    cy.intercept('POST', '/api/invoices/*/cancel').as('cancel')
    cy.get('[data-testid="invoice-cancel"]').click()
    cy.wait('@cancel').its('response.statusCode').should('eq', 200)
  })

  it('viewer solo debería ver: guardar/pagar/cancelar devuelven 403/409', () => {
    cy.loginAs('viewer')
    cy.selectInvoice('inv-001')
    cy.intercept('PATCH', '/api/invoices/*').as('save')
    cy.intercept('POST', '/api/invoices/*/pay').as('pay')
    cy.intercept('POST', '/api/invoices/*/cancel').as('cancel')

    cy.get('[data-testid="invoice-save"]').click({ force: true })
    cy.wait('@save').its('response.statusCode').should('be.oneOf', [403, 409])

    cy.get('[data-testid="invoice-pay"]').click({ force: true })
    cy.wait('@pay').its('response.statusCode').should('be.oneOf', [403, 409])

    cy.get('[data-testid="invoice-cancel"]').click({ force: true })
    cy.wait('@cancel').its('response.statusCode').should('be.oneOf', [403, 409])
  })
})
