'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('proposalTypesLookup', null, {});
      await queryInterface.removeColumn('proposalTypesLookup', 'type');
      await queryInterface.addColumn('proposalTypesLookup', 'name', {
         type: Sequelize.STRING,
         allowNull: false,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.bulkDelete('proposalTypesLookup', null, {});
      await queryInterface.removeColumn('proposalTypesLookup', 'name');
      await queryInterface.addColumn('proposalTypesLookup', 'type', {
         type: Sequelize.STRING,
         allowNull: false,
      });
   },
};
