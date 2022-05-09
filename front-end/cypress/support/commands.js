// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

export const recommendation = {
    name: 'Chitãozinho E Xororó - Evidências',
    youtubeLink: 'https://www.youtube.com/watch?v=ePjtnSPFWK8',
}

Cypress.Commands.add('resetDatabase', () => {
	cy.request('POST', 'http://localhost:5000/tests/reset');
});

Cypress.Commands.add('createRecommendation', () => {
    cy.visit('http://localhost:3000');

    cy.get('input[placeholder=Name]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(recommendation.youtubeLink);

    cy.intercept('POST', 'http://localhost:5000/recommendations').as('insertRecommendation');

    cy.get('button[type=submit]').click();

    cy.wait('@insertRecommendation');
});

Cypress.Commands.add('seedRecommendation', () => {
    cy.visit('http://localhost:3000');

    cy.get('input[placeholder=Name]').type(recommendation.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(recommendation.youtubeLink);

    cy.request('POST', 'http://localhost:5000/recommendations', recommendation).as('seedRecommendations');
    // cy.request('POST', 'http://localhost:5000/recommendations', {
    //     "name": "Falamansa - Xote dos Milagres",
    //     "youtubeLink": "https://www.youtube.com/watch?v=chwyjJbcs1Y"
    // }).as('seedRecomendation');

    cy.get('button[type=submit]').click();

    cy.wait('@seedRecommendations');
});