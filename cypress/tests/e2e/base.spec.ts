describe('base tests', () => {
    it('should start browser', () => {
        cy.visit('/');
        cy.get('body').contains('hello');
    });
})
