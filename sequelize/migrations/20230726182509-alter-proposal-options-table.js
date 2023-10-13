'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('proposalOptions', 'overrideDealerFee', {
         type: Sequelize.INTEGER,
         allowNull: true,
      });
      await queryInterface.addColumn('proposalOptions', 'includeTravelFee', {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn('proposalOptions', 'offsetDisclaimer', {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });

      await queryInterface.removeColumn('proposalOptionsExtended', 'pricePerKwOverride');
      await queryInterface.addColumn('proposalOptionsExtended', 'priceOverride', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });

      await queryInterface.createTable('financiersOnProducts', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.dropTable('proposalProductOptions', { force: true });
      await queryInterface.createTable('proposalProductsConfig', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         offsetPercentage: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         price: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         pricePerSquareFt: {
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

      await queryInterface.createTable('proposalBrackets', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
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
         travelFee: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         kw: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         ppw: {
            type: Sequelize.FLOAT,
            allowNull: true,
         },
         proposalProductConfigId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'proposalProductsConfig',
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
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('proposalProductsConfig', { force: true });
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

      await queryInterface.removeColumn('proposalOptions', 'offsetDisclaimer');
      await queryInterface.removeColumn('proposalOptions', 'includeTravelFee');
      await queryInterface.removeColumn('proposalOptions', 'overrideDealerFee');

      await queryInterface.removeColumn('proposalOptionsExtended', 'priceOverride');
      await queryInterface.addColumn('proposalOptionsExtended', 'pricePerKwOverride', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });

      await queryInterface.dropTable('proposalBrackets', { force: true });
      await queryInterface.dropTable('financiersOnProducts', { force: true });
   },
};
