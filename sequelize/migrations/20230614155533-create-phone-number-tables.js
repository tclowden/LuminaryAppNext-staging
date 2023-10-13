'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('phoneNumberTypesLookup', {
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
      });

      await queryInterface.bulkInsert('phoneNumberTypesLookup', [
         { name: 'User' },
         { name: 'Lead Source' },
         { name: 'Local Presence' },
         { name: 'Unassigned' },
      ]);

      await queryInterface.createTable('phoneNumbers', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         number: {
            type: Sequelize.STRING(12),
            allowNull: false,
            unique: true,
            validate: {
               len: [12, 12],
            },
         },
         numberSID: {
            type: Sequelize.STRING,
         },
         active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
         },
         typeId: {
            type: Sequelize.UUID,
            references: {
               model: 'phoneNumberTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('phoneNumbersOnUsers', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         userId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         phoneNumberId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'phoneNumbers',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('phoneNumbersOnLeadSources', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         leadSourceId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'leadSources',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         phoneNumberId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'phoneNumbers',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('reputationOnPhoneNumbers', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         score: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         phoneNumberId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'phoneNumbers',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('reputationOnPhoneNumbers', { force: true });
      await queryInterface.dropTable('phoneNumbersOnLeadSources', { force: true });
      await queryInterface.dropTable('phoneNumbersOnUsers', { force: true });
      await queryInterface.dropTable('phoneNumbers', { force: true });
      await queryInterface.dropTable('phoneNumberTypesLookup', { force: true });
   },
};
