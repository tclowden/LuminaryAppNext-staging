'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('proposalOptionEnergyUsages', 'utilityCompanyId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'utilityCompaniesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });

      await queryInterface.addColumn('proposalOptionEnergyUsages', 'stateId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'statesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });

      await queryInterface.removeColumn('proposalOptionEnergyUsages', 'stateName');
      await queryInterface.removeColumn('proposalOptionEnergyUsages', 'utilityCompany');
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.addColumn('proposalOptionEnergyUsages', 'stateName', {
         type: Sequelize.STRING,
         allowNull: true,
      });

      await queryInterface.addColumn('proposalOptionEnergyUsages', 'utilityCompany', {
         type: Sequelize.STRING,
         allowNull: true,
      });

      await queryInterface.removeColumn('proposalOptionEnergyUsages', 'stateId');
      await queryInterface.removeColumn('proposalOptionEnergyUsages', 'utilityCompanyId');
   },
};
