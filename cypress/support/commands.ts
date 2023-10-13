/// <reference types="cypress" />
// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- Login command --
Cypress.Commands.add('login', (email, password) => {
   cy.visit('http://localhost:3000/login');
   cy.get('[data-test="emailAddress"]').type(email);
   cy.get('[data-test="password"]').type(password);
   cy.get('[data-test="submitBtn"]').click();
   // need to wait... give the browser enough time to set the cookie
   cy.wait(2000);
});

// click any button by data-test attribute
Cypress.Commands.add('clickBtn', (attrName) => {
   cy.get(`[data-test="${attrName}"]`).click();
});

export {};
