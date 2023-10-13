'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('revisionsRequested', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         energyUsage: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         sqFtRoof: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         electricCompany: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         other: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         note: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
         },
         proposalQueueId: {
            type: Sequelize.UUID,
            references: {
               model: 'proposalQueue',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
         deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
         },
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('revisionsRequested');
   },
};
