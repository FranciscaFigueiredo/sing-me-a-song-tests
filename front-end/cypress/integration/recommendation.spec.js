import { recommendation } from "../support/commands";

describe("POST recommendation", () => {
	beforeEach(() => {
		cy.resetDatabase();
	});

	it("must post recommendation and succeed", () => {
        console.log(Cypress.spec)
		
		cy.createRecommendation();
		
		cy.contains(recommendation.name);

		cy.end();
	});
});

describe("POST vote", () => {
	beforeEach(() => {
		cy.createRecommendation();
	});

	afterEach(() => {
		cy.resetDatabase();
	});

	it("must post upvote and succeed", () => {
		cy.get('#GoArrowUp').click();
		cy.contains(1);

		cy.end();
	});

	it("must post downvote and succeed", () => {
		cy.get('#GoArrowDown').click();
		cy.contains(-1);

		cy.end();
	});
});

describe("TOP page", () => {
	it("should go to top recommendations page when click", () => {
		cy.visit('http://localhost:3000');

		cy.get('#top').click();
	
		cy.url().should('eq', 'http://localhost:3000/top');

		cy.end();
	});
});

describe("RANDOM page", () => {
	it("should go to top recommendations page when click", () => {
		cy.visit('http://localhost:3000');

		cy.get('#random').click();
		
		cy.url().should('eq', 'http://localhost:3000/random') 

		cy.end();
	});
});