'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // create all configurableListsLookup rows
      await queryInterface.bulkInsert('netMeteringTypesLookup', [
         { name: 'None' },
         { name: 'Lose It' },
         { name: 'Full Benefit' },
      ]);
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('netMeteringTypesLookup', {}, {});
   },
};
