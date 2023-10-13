'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.dropTable('proposalOptionBatteries', { force: true });
      await queryInterface.dropTable('proposalOptionEes', { force: true });
      await queryInterface.dropTable('proposalOptionEnergyUsages', { force: true });
      await queryInterface.dropTable('proposalOptionFinancingInformations', { force: true });
      await queryInterface.dropTable('proposalOptionHvacs', { force: true });
      await queryInterface.dropTable('proposalOptionProducts', { force: true });
      await queryInterface.dropTable('proposalOptions', { force: true });
      await queryInterface.dropTable('proposalOptionSolars', { force: true });
      await queryInterface.dropTable('proposalProductPrices', { force: true });
      await queryInterface.dropTable('proposalSettings', { force: true });
      await queryInterface.removeColumn('proposalTaxSettings', 'proposalSettingId');
      await queryInterface.removeColumn('proposalTaxSettings', 'state');
      await queryInterface.addColumn('proposalTaxSettings', 'stateId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'statesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.addColumn('proposalTaxSettings', 'proposalSettingId', {
         type: Sequelize.UUID,
         allowNull: true,
      });
      await queryInterface.removeColumn('proposalTaxSettings', 'stateId');
      await queryInterface.addColumn('proposalTaxSettings', 'state', {
         type: Sequelize.STRING,
         allowNull: true,
      });

      await queryInterface.createTable('proposalOptions', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: Sequelize.STRING,
         proposalTypeId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         leadId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         proposalTechId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
      await queryInterface.createTable('proposalOptionSolars', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
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
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
      await queryInterface.createTable('proposalOptionProducts', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         productId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'productsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
      await queryInterface.createTable('proposalOptionHvacs', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
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
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
      await queryInterface.createTable('proposalOptionFinancingInformations', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         financierId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'financiersLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
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
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
      await queryInterface.createTable('proposalOptionEnergyUsages', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         stateId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'statesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         utilityCompanyId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'utilityCompaniesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
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
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
      await queryInterface.createTable('proposalOptionEes', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         eePackage: Sequelize.STRING,
         eeSquareFootage: Sequelize.DOUBLE,
         eeAdditionalCost: Sequelize.DOUBLE,
         overrideOffset: Sequelize.INTEGER,
         eeNotes: Sequelize.STRING,
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
      await queryInterface.createTable('proposalOptionBatteries', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         batteryType: Sequelize.INTEGER,
         unitAmount: Sequelize.INTEGER,
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
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
   },
};
