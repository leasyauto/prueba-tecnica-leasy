describe('facturas - estados y sincronía', () => {
  beforeEach(() => {
    cy.resetDemoState()
  })

  it('al congelar responde 200 y queda FROZEN', () => {
    cy.loginAs('admin')
    cy.selectInvoice('inv-003') // DRAFT
    cy.intercept('POST', '/api/invoices/*/freeze').as('freeze')
    cy.get('[data-testid="invoice-freeze"]').click()
    cy.wait('@freeze').its('response.statusCode').should('eq', 200)
    cy.request('/api/invoices').then((resp) => {
      const invoice = resp.body.find((i: { id: string }) => i.id === 'inv-003')
      expect(invoice.status).to.eq('FROZEN')
    })
  })

  it('una factura FROZEN no debería pagarse (403/409)', () => {
    cy.loginAs('admin')
    cy.selectInvoice('inv-002') // FROZEN
    cy.intercept('POST', '/api/invoices/*/pay').as('pay')
    cy.payInvoice()
    cy.wait('@pay').its('response.statusCode').should('be.oneOf', [403, 409])
    cy.request('/api/invoices').then((resp) => {
      const invoice = resp.body.find((i: { id: string }) => i.id === 'inv-002')
      expect(invoice.status).to.eq('FROZEN')
    })
  })

  it('una factura CANCELLED no debería aceptar ediciones (403/409)', () => {
    cy.loginAs('admin')
    cy.selectInvoice('inv-001')
    cy.intercept('POST', '/api/invoices/*/cancel').as('cancel')
    cy.get('[data-testid="invoice-cancel"]').click()
    cy.wait('@cancel').its('response.statusCode').should('eq', 200)
    cy.intercept('PATCH', '/api/invoices/*').as('save')
    cy.applyCoupon({ amount: 10 })
    cy.saveInvoice()
    cy.wait('@save').its('response.statusCode').should('be.oneOf', [403, 409])
  })

  it('el estado nuevo se ve en lista y detalle sin refrescar', () => {
    cy.loginAs('admin')
    cy.selectInvoice('inv-003') // DRAFT
    cy.intercept('POST', '/api/invoices/*/freeze').as('freeze')
    cy.get('[data-testid="invoice-freeze"]').click()
    cy.wait('@freeze').its('response.statusCode').should('eq', 200)
    cy.get('[data-testid="selected-invoice-status"]').should('contain', 'FROZEN')
    cy.get('[data-testid="invoice-row-inv-003"] .list-meta span').first().should('contain', 'FROZEN')
  })
})
