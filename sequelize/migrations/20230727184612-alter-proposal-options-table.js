'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalOptions', 'displayCalculator');
      await queryInterface.removeColumn('proposalOptions', 'connectionFee');
      await queryInterface.removeColumn('proposalOptions', 'stateId');

      await queryInterface.removeColumn('proposalOptionsExtended', 'proposalProductOptionId');
      await queryInterface.addColumn('proposalOptionsExtended', 'proposalProductConfigId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            // this table has battery and hvac names
            model: 'proposalProductsConfig',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });

      await queryInterface.addColumn('proposalOptionsExtended', 'archived', {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn('proposalOptionsExtended', 'createdAt', {
         type: Sequelize.DATE,
         allowNull: false,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      });
      await queryInterface.addColumn('proposalOptionsExtended', 'updatedAt', {
         type: Sequelize.DATE,
         allowNull: false,
         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      });

      await queryInterface.removeColumn('proposalOptionsExtended', 'doNetMeter');
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.addColumn('proposalOptionsExtended', 'doNetMeter', {
         type: Sequelize.BOOLEAN,
         allowNull: true,
      });

      await queryInterface.removeColumn('proposalOptionsExtended', 'archived');
      await queryInterface.removeColumn('proposalOptionsExtended', 'createdAt');
      await queryInterface.removeColumn('proposalOptionsExtended', 'updatedAt');

      await queryInterface.removeColumn('proposalOptionsExtended', 'proposalProductConfigId');
      await queryInterface.addColumn('proposalOptionsExtended', 'proposalProductOptionId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            // this table has battery and hvac names
            model: 'proposalProductsConfig',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });

      await queryInterface.addColumn('proposalOptions', 'stateId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'statesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
      await queryInterface.addColumn('proposalOptions', 'connectionFee', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('proposalOptions', 'displayCalculator', {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
   },
};
