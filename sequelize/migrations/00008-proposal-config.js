'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      // await queryInterface.createTable('solarAddons', {
      //    id: {
      //       type: Sequelize.UUID,
      //       primaryKey: true,
      //       allowNull: false,
      //       defaultValue: Sequelize.literal('uuid_generate_v4()'),
      //    },
      //    name: {
      //       type: Sequelize.STRING,
      //    },
      //    ppw: {
      //       type: Sequelize.FLOAT,
      //    },
      //    batch: {
      //       type: Sequelize.STRING,
      //    },
      //    createdAt: {
      //       allowNull: false,
      //       type: Sequelize.DATE,
      //       defaultValue: Sequelize.NOW,
      //    },
      //    updatedAt: {
      //       allowNull: false,
      //       type: Sequelize.DATE,
      //       defaultValue: Sequelize.NOW,
      //    },
      // });

      await queryInterface.createTable('solarPrices', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         state: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         travelFee: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
         },
         systemType: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         brackets: {
            type: Sequelize.STRING,
         },
         batch: {
            type: Sequelize.STRING,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
         },
      });

      await queryInterface.createTable('proposalTaxSettings', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         state: Sequelize.STRING,
         zipCode: Sequelize.STRING,
         taxRegionName: Sequelize.STRING,
         combinedRate: Sequelize.FLOAT,
         stateTaxRate: Sequelize.STRING,
         county: Sequelize.FLOAT,
         city: Sequelize.FLOAT,
         special: Sequelize.FLOAT,
         riskLevel: Sequelize.INTEGER,
         proposalSettingId: Sequelize.STRING,
         createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
         updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
      });

      await queryInterface.createTable('proposalProductPrices', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         eePpw: Sequelize.FLOAT,
         batteryJson: Sequelize.STRING,
         hvacJson: Sequelize.STRING,
         createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
         updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
      });

      await queryInterface.createTable('proposalSettings', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         universalDealerFee: Sequelize.FLOAT,
         dealerFeeSolar: Sequelize.BOOLEAN,
         dealerFeeHvac: Sequelize.BOOLEAN,
         dealerFeeEe: Sequelize.BOOLEAN,
         dealerFeeBattery: Sequelize.BOOLEAN,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
         },
      });
   },

   down: async (queryInterface, Sequelize) => {
      // await queryInterface.dropTable('solarAddons');
      await queryInterface.dropTable('solarPrices');
      await queryInterface.dropTable('proposalTaxSettings');
      await queryInterface.dropTable('proposalSettings');
      await queryInterface.dropTable('proposalProductPrices');
   },
};
