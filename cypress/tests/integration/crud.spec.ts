describe('crud operations on graphql', () => {
    it('should find one post by id', () => {
        const graphqlQuery = '{ post(id: 1) { id title } }'
        cy.request({
            method: 'POST',
            url: '/graphql',
            body: {
                'query': graphqlQuery
            }
        }).then(resp => {
            expect(resp.status).to.eq(200);
            cy.log(resp.body);
            cy.wrap(resp.body)
                .its('data').should('have.property', 'post')
                .its('title').should('eq', 'My first updated post');
        });
    });
});
