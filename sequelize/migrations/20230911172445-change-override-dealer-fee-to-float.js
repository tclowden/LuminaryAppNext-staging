'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      queryInterface.changeColumn('proposalOptions', 'overrideDealerFee', {
         type: Sequelize.FLOAT,
         allowNull: true,
         defaultValue: null,
      });

      queryInterface.removeColumn('proposalOptionsExtended', 'duelFuelUpgrate');
      queryInterface.addColumn('proposalOptionsExtended', 'dualFuelUpgrade', {
         type: Sequelize.BOOLEAN,
         allowNull: true,
         defaultValue: false,
      });
   },

   async down(queryInterface, Sequelize) {
      queryInterface.changeColumn('proposalOptions', 'overrideDealerFee', {
         type: Sequelize.FLOAT,
         allowNull: true,
         defaultValue: null,
      });

      queryInterface.addColumn('proposalOptionsExtended', 'duelFuelUpgrate', {
         type: Sequelize.BOOLEAN,
         allowNull: true,
         defaultValue: false,
      });
      queryInterface.removeColumn('proposalOptionsExtended', 'dualFuelUpgrade');
   },
};
