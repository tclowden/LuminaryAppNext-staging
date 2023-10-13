'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('callRoutes', {
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
         description: {
            type: Sequelize.TEXT,
         },
         active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
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

      await queryInterface.createTable('phoneNumbersOnCallRoutes', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         callRouteId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'callRoutes',
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

      await queryInterface.createTable('callRouteActionTypesLookup', {
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

      await queryInterface.bulkInsert('callRouteActionTypesLookup', [
         { id: '3f4d2d2b-c8cc-4c06-9b4b-2450d026b452', name: 'Ring a specific user' },
         { id: '5e3b52ef-7cf2-48af-a90a-36847f7f9b07', name: 'Ring a user role' },
         { id: 'b6031e3f-0855-48b0-9527-0a2390a43748', name: 'Forward to an external number' },
         { id: 'e0b8cafa-1f5d-446e-8113-a0878290c9d3', name: 'Send to voicemail' },
         { id: '24ca0bf3-9350-49bf-88dc-5bbcef528264', name: 'Play a MP3 file' },
         { id: '8315c130-8503-4474-b3b9-d34dc78bb57d', name: 'Say a phrase' },
      ]);

      await queryInterface.createTable('actionsOnCallRoutes', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         callRouteId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'callRoutes',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         actionTypeId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'callRouteActionTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         userIdsToDial: {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
         },
         roleIdsToDial: {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
         },
         waitSeconds: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         messageToSay: {
            type: Sequelize.TEXT,
         },
         waitMusicUrl: {
            type: Sequelize.STRING,
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
      await queryInterface.dropTable('callRouteActionTypesLookup', { force: true });
      await queryInterface.dropTable('actionsOnCallRoutes', { force: true });
      await queryInterface.dropTable('phoneNumbersOnCallRoutes', { force: true });
      await queryInterface.dropTable('callRoutes', { force: true });
   },
};
