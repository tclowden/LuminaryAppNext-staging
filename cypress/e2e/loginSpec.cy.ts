describe('Success Login', () => {
   it('Visit Login Page', () => {
      cy.visit('http://localhost:3000/login');
   });
   it('Fail Login (Empty Fields)', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('[data-test="emailAddress"]');
      cy.get('[data-test="password"]');
      cy.get('[data-test="submitBtn"]').click();
   });
   it('Fail Login (Empty Password)', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('[data-test="emailAddress"]').type('mrapp@shinesolar.com');
      cy.get('[data-test="password"]');
      cy.get('[data-test="submitBtn"]').click();
   });
   it('Fail Login (Empty Email)', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('[data-test="emailAddress"]');
      cy.get('[data-test="password"]').type('testtest');
      cy.get('[data-test="submitBtn"]').click();
   });
   it('Fail Login (Wrong Email)', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('[data-test="emailAddress"]').type('emaildoesnotexist@gmail.com');
      cy.get('[data-test="password"]').type('testtest');
      cy.get('[data-test="submitBtn"]').click();
   });
   it('Fail Login (Wrong Password)', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('[data-test="emailAddress"]').type('developer@shinesolar.com');
      cy.get('[data-test="password"]').type('testtest');
      cy.get('[data-test="submitBtn"]').click();
   });
   it('Success Login', () => {
      cy.login('developer@shinesolar.com', 'lumdeveloper');
   });
});

export {};
