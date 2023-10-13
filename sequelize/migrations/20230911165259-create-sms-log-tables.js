'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('smsLogs', {
         id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         messageSid: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         to: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         from: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         body: {
            type: Sequelize.TEXT,
            allowNull: false,
         },
         direction: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         mmsUrls: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
         },
         leadId: {
            type: Sequelize.UUID,
            allowNull: true,
         },
         sentFromUserId: {
            type: Sequelize.UUID,
            allowNull: true,
         },
         sentToUserId: {
            type: Sequelize.UUID,
            allowNull: true,
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
         deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
         },
      });

      await queryInterface.addIndex('smsLogs', ['to']);
      await queryInterface.addIndex('smsLogs', ['from']);

      await queryInterface.createTable('smsAcknowledgedBy', {
         id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         smsLogId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'smsLogs',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         acknowledgedByUserId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
         deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
         },
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('smsAcknowledgedBy');
      await queryInterface.dropTable('smsLogs');
   },
};
