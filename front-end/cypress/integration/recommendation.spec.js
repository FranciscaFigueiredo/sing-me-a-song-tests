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
