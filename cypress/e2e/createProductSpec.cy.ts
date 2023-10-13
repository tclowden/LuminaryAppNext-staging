describe('Creating a product', () => {
   let cypressRandom = Cypress._.random(9999);

   it('Logging in', () => {
      cy.login('developer@shinesolar.com', 'lumdeveloper');
   });
   it('Create a Product Task', () => {
      cy.clickBtn('adminAppSidebarLink');
      cy.clickBtn('tasksPageSidebarLink');
      cy.location('pathname', { timeout: 3000 }).should('contain', 'tasks');
      cy.clickBtn('createBtn');
      cy.get('[data-test="name"]').type(`Cypress Task ${cypressRandom}`);
      cy.get('[data-test="description"]').type(`Cypress description with random number here --> ${cypressRandom}`);
      cy.clickBtn('submitBtn');
   });
   it('Create a Product Field', () => {
      cy.clickBtn('adminAppSidebarLink');
      cy.clickBtn('fieldsPageSidebarLink');
      cy.location('pathname', { timeout: 3000 }).should('contain', 'fields');
      cy.clickBtn('createBtn');
      cy.clickBtn('fieldType').then((btnEl: any) => {
         cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(1).click();
      });
      cy.get('[data-test="label"]').type(`Cypress Field ${cypressRandom}`);
      cy.get('[data-test="placeholder"]').type(`Cypress Placeholder ${cypressRandom}`);
      cy.clickBtn('submitBtn');
   });
   it('Create a Product Stage', () => {
      cy.clickBtn('adminAppSidebarLink');
      cy.clickBtn('stagesPageSidebarLink');
      cy.location('pathname', { timeout: 3000 }).should('contain', 'stages');
      cy.clickBtn('createBtn');
      cy.get('[data-test="name"]').type(`Cypress Stage ${cypressRandom}`);
      cy.clickBtn('stageType').then((btnEl: any) => {
         cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(1).click();
      });
      cy.clickBtn('submitBtn');
   });
   it('Create a Product Coordinator', () => {
      cy.clickBtn('adminAppSidebarLink');
      cy.clickBtn('coordinatorsPageSidebarLink');
      cy.location('pathname', { timeout: 3000 }).should('contain', 'coordinators');
      cy.clickBtn('createBtn');
      cy.get('[data-test="name"]').type(`Cypress Coordinator ${cypressRandom}`);
      cy.clickBtn('addExcludedRoleBtn').then((btnEl: any) => {
         cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(1).click();
      });
      cy.clickBtn('submitBtn');
   });
   it('Create a Product', () => {
      cy.clickBtn('adminAppSidebarLink');
      cy.clickBtn('productsPageSidebarLink');
      cy.location('pathname', { timeout: 3000 }).should('contain', 'products');
      cy.clickBtn('createBtn');
      cy.get('[data-test="name"]').type(`Cypress Product name --> ${cypressRandom}`);
      cy.get('[data-test="description"]').type(
         `Cypress Product description --> ${cypressRandom}... what a time to be alive, am i right??`
      );
      cy.clickBtn('iconColor').then((btnEl: any) => {
         cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(2).click();
      });
      cy.clickBtn('iconName').then((btnEl: any) => {
         cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(Cypress._.random(30)).click();
      });
      cy.clickBtn('primary').then((btnEl: any) => {
         cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(0).click();
      });

      // if button is disabled, do nothing... if it's not, add
      cy.get('[data-test="addCoordinatorChildBtn"]')
         .invoke('attr', 'disabled')
         .then((disabled: any) => {
            if (disabled) cy.log('addCoordinatorChildBtn is disabled');
            else {
               cy.clickBtn('addCoordinatorChildBtn').then((btnEl: any) => {
                  cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(0).click();
               });
            }
         });

      // if button is disabled, do nothing... if it's not, add
      cy.get('[data-test="addFieldChildBtn"]')
         .invoke('attr', 'disabled')
         .then((disabled: any) => {
            if (disabled) cy.log('addFieldChildBtn is disabled');
            else {
               cy.clickBtn('addFieldChildBtn').then((btnEl: any) => {
                  cy.get(btnEl).get('[data-test="optionSelector"]').first().children().eq(0).click();
               });
            }
         });

      cy.clickBtn('collapseContainers');
      cy.clickBtn('submitBtn');
   });
});

export {};
