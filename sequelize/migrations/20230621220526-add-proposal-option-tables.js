'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('proposalOptions', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: Sequelize.STRING,
         proposalType: Sequelize.STRING,
         leadId: Sequelize.STRING,
         proposalTech: Sequelize.INTEGER,
         archived: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('proposalOptionProducts', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptions: Sequelize.STRING,
         product: Sequelize.STRING,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('proposalOptionEnergyUsages', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptions: Sequelize.STRING,
         stateName: Sequelize.STRING,
         utilityCompany: Sequelize.STRING,
         connectionFee: Sequelize.DOUBLE,
         janUsage: Sequelize.DOUBLE,
         janBill: Sequelize.DOUBLE,
         febUsage: Sequelize.DOUBLE,
         febBill: Sequelize.DOUBLE,
         marUsage: Sequelize.DOUBLE,
         marBill: Sequelize.DOUBLE,
         aprUsage: Sequelize.DOUBLE,
         aprBill: Sequelize.DOUBLE,
         mayUsage: Sequelize.DOUBLE,
         mayBill: Sequelize.DOUBLE,
         junUsage: Sequelize.DOUBLE,
         junBill: Sequelize.DOUBLE,
         julUsage: Sequelize.DOUBLE,
         julBill: Sequelize.DOUBLE,
         augUsage: Sequelize.DOUBLE,
         augBill: Sequelize.DOUBLE,
         sepUsage: Sequelize.DOUBLE,
         sepBill: Sequelize.DOUBLE,
         octUsage: Sequelize.DOUBLE,
         octBill: Sequelize.DOUBLE,
         novUsage: Sequelize.DOUBLE,
         novBill: Sequelize.DOUBLE,
         decUsage: Sequelize.DOUBLE,
         decBill: Sequelize.DOUBLE,
         doNetMeter: Sequelize.BOOLEAN,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('proposalOptionFinancingInformations', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         loanProductId: Sequelize.UUID,
         downPayment: Sequelize.DOUBLE,
         taxCreditAsDownpayment: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         displayCalculator: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         savingsOptionDisplay: Sequelize.STRING,
         proposalOptions: Sequelize.STRING,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('proposalOptionSolars', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptions: Sequelize.STRING,
         systemSize: Sequelize.DOUBLE,
         panelSize: Sequelize.DOUBLE,
         numberOfPanels: Sequelize.DOUBLE,
         homeImageUrl: Sequelize.TEXT,
         janProduction: Sequelize.DOUBLE,
         febProduction: Sequelize.DOUBLE,
         marProduction: Sequelize.DOUBLE,
         aprProduction: Sequelize.DOUBLE,
         mayProduction: Sequelize.DOUBLE,
         junProduction: Sequelize.DOUBLE,
         julProduction: Sequelize.DOUBLE,
         augProduction: Sequelize.DOUBLE,
         sepProduction: Sequelize.DOUBLE,
         octProduction: Sequelize.DOUBLE,
         novProduction: Sequelize.DOUBLE,
         decProduction: Sequelize.DOUBLE,
         pricePerKw: Sequelize.DOUBLE,
         totalCost: Sequelize.DOUBLE,
         solarAdditionalCost: Sequelize.DOUBLE,
         checkCost: Sequelize.DOUBLE,
         trenchingCost: Sequelize.DOUBLE,
         systemType: Sequelize.STRING,
         roofKw: Sequelize.DOUBLE,
         groundKw: Sequelize.DOUBLE,
         roofSquareFt: Sequelize.DOUBLE,
         notes: Sequelize.TEXT,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('proposalOptionEes', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptions: Sequelize.STRING,
         eePackage: Sequelize.STRING,
         eeSquareFootage: Sequelize.DOUBLE,
         eeAdditionalCost: Sequelize.DOUBLE,
         overrideOffset: Sequelize.INTEGER,
         eeNotes: Sequelize.STRING,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('proposalOptionHvacs', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptions: Sequelize.STRING,
         hvacUnit: Sequelize.STRING,
         furnace: Sequelize.STRING,
         waterHeater: Sequelize.STRING,
         miniSplit: Sequelize.STRING,
         duelFuelUpgrade: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         quantity: Sequelize.INTEGER,
         hvacAdditionalCost: Sequelize.DOUBLE,
         hvacSquareFootage: Sequelize.DOUBLE,
         hvacNotes: Sequelize.TEXT,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('proposalOptionBatteries', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptions: Sequelize.STRING,
         batteryType: Sequelize.INTEGER,
         unitAmount: Sequelize.INTEGER,
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('proposalOptions');
      await queryInterface.dropTable('proposalOptionProducts');
      await queryInterface.dropTable('proposalOptionEnergyUsages');
      await queryInterface.dropTable('proposalOptionFinancingInformations');
      await queryInterface.dropTable('proposalOptionSolars');
      await queryInterface.dropTable('proposalOptionEes');
      await queryInterface.dropTable('proposalOptionHvacs');
      await queryInterface.dropTable('proposalOptionBatteries');
   },
};
