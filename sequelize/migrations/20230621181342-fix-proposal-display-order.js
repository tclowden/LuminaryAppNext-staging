'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // update all the displayOrders for the installs app... was duplicate in the pages init migration
      const pageDisplayOrderNeedingToChange = [
         { id: 'fe4013f0-a140-497c-ae18-42e2d3704d43', displayOrder: 1 },
         { id: '385ec521-a0c1-417b-9609-dba9b57cb1ea', displayOrder: 2 },
         { id: '884b889c-96f5-4f22-9ec0-9e4662a21fd1', displayOrder: 3 },
         { id: 'a757683a-65a4-4503-897a-fc4bdb6ae956', displayOrder: 4 },
         { id: '742aee79-cf6f-47e6-ad4a-4c4da5f43209', displayOrder: 5 },
      ];
      for (const page of pageDisplayOrderNeedingToChange) {
         await queryInterface.bulkUpdate('pagesLookup', { displayOrder: page.displayOrder }, { id: page.id });
      }
   },

   async down(queryInterface, Sequelize) {
      const pageDisplayOrderNeedingToChange = [
         { id: 'fe4013f0-a140-497c-ae18-42e2d3704d43', displayOrder: 1 },
         { id: '385ec521-a0c1-417b-9609-dba9b57cb1ea', displayOrder: 2 },
         { id: '884b889c-96f5-4f22-9ec0-9e4662a21fd1', displayOrder: 3 },
         { id: 'a757683a-65a4-4503-897a-fc4bdb6ae956', displayOrder: 4 },
         { id: '742aee79-cf6f-47e6-ad4a-4c4da5f43209', displayOrder: 1 },
      ];
      for (const page of pageDisplayOrderNeedingToChange) {
         await queryInterface.bulkUpdate('pagesLookup', { displayOrder: page.displayOrder }, { id: page.id });
      }
   },
};
