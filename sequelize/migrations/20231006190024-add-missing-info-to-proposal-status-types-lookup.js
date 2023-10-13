'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.bulkInsert(
         'proposalStatusTypesLookup',
         [
            {
               name: 'Missing Info',
            },
         ],
         {}
      );
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete(
         'proposalStatusTypesLookup',
         {
            name: 'Missing Info',
         },
         {}
      );
   },
};
