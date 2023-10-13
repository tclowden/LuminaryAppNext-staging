/// <reference types="cypress" />

declare namespace Cypress {
   interface Chainable<Subject = any> {
      /**
       * Custom command to ... add your description here
       * @example cy.clickOnMyJourneyInCandidateCabinet()
       */
      login(email: string, password: string): Chainable<null>;
      clickBtn(attrName: string): Chainable<null>;
   }
}
