'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('callLogs', {
         id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         leadId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'leads',
               key: 'id',
            },
            onDelete: 'CASCADE',
         },
         userId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'users',
               key: 'id',
            },
            onDelete: 'CASCADE',
         },
         sid: {
            type: Sequelize.STRING,
         },
         from: {
            type: Sequelize.STRING,
         },
         to: {
            type: Sequelize.STRING,
         },
         callStatus: {
            type: Sequelize.STRING,
         },
         direction: {
            type: Sequelize.STRING,
         },
         duration: {
            type: Sequelize.INTEGER,
         },
         recordingUrl: {
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

      await queryInterface.addIndex('callLogs', ['from']);
      await queryInterface.addIndex('callLogs', ['to']);
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('callLogs');
   },
};
