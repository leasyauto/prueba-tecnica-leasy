describe('facturas - cupones', () => {
  beforeEach(() => {
    cy.resetDemoState()
    cy.loginAs('admin')
    cy.selectInvoice('inv-001') // baseAmount 1250
  })

  it('si el cupón deja el total en 0 no debería guardar ni pagar', () => {
    cy.intercept('PATCH', '/api/invoices/*').as('save')
    cy.intercept('POST', '/api/invoices/*/pay').as('pay')
    cy.applyCoupon({ code: 'FULL', amount: 1250 })
    cy.saveInvoice()
    cy.wait('@save').its('response.statusCode').should('be.oneOf', [400, 409])
    cy.payInvoice()
    cy.wait('@pay').its('response.statusCode').should('be.oneOf', [403, 409])
  })

  it('si el cupón deja total negativo no debería guardar ni pagar', () => {
    cy.intercept('PATCH', '/api/invoices/*').as('save')
    cy.intercept('POST', '/api/invoices/*/pay').as('pay')
    cy.applyCoupon({ code: 'OVER', amount: 1300 })
    cy.saveInvoice()
    cy.wait('@save').its('response.statusCode').should('be.oneOf', [400, 409])
    cy.payInvoice()
    cy.wait('@pay').its('response.statusCode').should('be.oneOf', [403, 409])
  })
})
