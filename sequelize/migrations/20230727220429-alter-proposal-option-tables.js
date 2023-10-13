'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalOptionsExtended', 'kw');
      await queryInterface.removeColumn('proposalOptionsExtended', 'selected');
      await queryInterface.addColumn('proposalOptions', 'selected', {
         type: Sequelize.BOOLEAN,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalOptions', 'selected');
      await queryInterface.addColumn('proposalOptionsExtended', 'selected', {
         type: Sequelize.BOOLEAN,
         allowNull: true,
      });
      await queryInterface.addColumn('proposalOptionsExtended', 'kw', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
   },
};
