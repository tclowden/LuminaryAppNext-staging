'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /**
       * Add altering commands here.
       *
       * Example:
       * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
       */

      const tables = [
         'proposalOptionBatteries',
         'proposalOptionEes',
         'proposalOptionEnergyUsages',
         'proposalOptionFinancingInformations',
         'proposalOptionHvacs',
         // 'proposalOptionProducts',
         'proposalOptionSolars',
      ];

      for (const table of tables) {
         await queryInterface.removeColumn(table, 'proposalOptions');
         await queryInterface.addColumn(table, 'proposalOptionId', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         });
      }

      await queryInterface.removeColumn('proposalOptions', 'proposalType');
      await queryInterface.addColumn('proposalOptions', 'proposalTypeId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'proposalTypesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
      await queryInterface.removeColumn('proposalOptions', 'leadId');
      await queryInterface.addColumn('proposalOptions', 'leadId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'leads',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
      await queryInterface.removeColumn('proposalOptions', 'proposalTech');
      await queryInterface.addColumn('proposalOptions', 'proposalTechId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalOptions', 'proposalTypeId');
      await queryInterface.addColumn('proposalOptions', 'proposalType', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.removeColumn('proposalOptions', 'leadId');
      await queryInterface.addColumn('proposalOptions', 'leadId', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.removeColumn('proposalOptions', 'proposalTechId');
      await queryInterface.addColumn('proposalOptions', 'proposalTech', {
         type: Sequelize.INTEGER,
         allowNull: true,
      });

      const tables = [
         'proposalOptionBatteries',
         'proposalOptionEes',
         'proposalOptionEnergyUsages',
         'proposalOptionFinancingInformations',
         'proposalOptionHvacs',
         // 'proposalOptionProducts',
         'proposalOptionSolars',
      ];

      for (const table of tables) {
         await queryInterface.removeColumn(table, 'proposalOptionId');
         await queryInterface.addColumn(table, 'proposalOptions', {
            type: Sequelize.STRING,
            allowNull: true,
         });
      }
   },
};
