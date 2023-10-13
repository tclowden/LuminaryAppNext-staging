'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('proposalSavingOptionTypesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
            allowNull: false,
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalSystemTypesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
            allowNull: false,
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalProductOptions', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         offsetPercentage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         price: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         productId: {
            type: Sequelize.UUID,
            allowNull: false,
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalOptions', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         proposalTypeId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'proposalTypesLookup',
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
         leadId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         connectionFee: {
            type: Sequelize.FLOAT,
            allowNull: true,
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
         downPayment: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         taxCreditAsDownPayment: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         displayCalculator: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         savingsOptionDisplayId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalSavingOptionTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         totalCost: {
            type: Sequelize.FLOAT,
            allowNull: true,
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalOptionsExtended', {
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
         doNetMeter: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
         },
         systemSize: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         panelSize: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         numberOfPanels: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         homeImageUrl: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         pricePerKwOverride: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         additionalCost: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         checkCost: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         trenchingCost: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         systemTypeId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalSystemTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         kw: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         notes: {
            type: Sequelize.TEXT,
            allowNull: true,
         },
         squareFootage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         overrideOffset: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         proposalProductOptionId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               // this table has battery and hvac names
               model: 'proposalProductOptions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         duelFuelUpgrate: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
         },
         quanity: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         selected: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
         },
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalMonthlyProjections', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         janProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         janUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         janBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         febProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         febUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         febBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         marProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         marUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         marBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         aprProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         aprUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         aprBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         mayProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         mayUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         mayBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         junProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         junUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         junBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         julProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         julUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         julBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         augProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         augUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         augBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         sepProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         sepUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         sepBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         octProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         octUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         octBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         novProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         novUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         novBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         decProduction: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         decUsage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         decBill: {
            type: Sequelize.FLOAT,
            allowNull: true,
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalSettings', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         universalDealerFee: {
            type: Sequelize.FLOAT,
            allowNull: false,
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.addColumn('proposalTaxSettings', 'proposalSettingId', {
         type: Sequelize.UUID,
         allowNull: false,
         references: {
            model: 'proposalSettings',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalTaxSettings', 'proposalSettingId');
      await queryInterface.dropTable('proposalSettings', { force: true });
      await queryInterface.dropTable('proposalMonthlyProjections', { force: true });
      await queryInterface.dropTable('proposalOptionsExtended', { force: true });
      await queryInterface.dropTable('proposalOptions', { force: true });
      await queryInterface.dropTable('proposalProductOptions', { force: true });
      await queryInterface.dropTable('proposalSystemTypesLookup', { force: true });
      await queryInterface.dropTable('proposalSavingOptionTypesLookup', { force: true });
   },
};
