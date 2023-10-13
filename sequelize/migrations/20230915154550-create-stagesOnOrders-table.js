'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('stagesOnOrders', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         stageOnProductId: {
            type: Sequelize.UUID,
            references: {
               model: 'stagesOnProducts',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         orderId: {
            type: Sequelize.UUID,
            references: {
               model: 'orders',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         assignedToId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         assignedAt: {
            type: Sequelize.DATE,
         },
         completedAt: {
            type: Sequelize.DATE,
         },
         oldId: {
            type: Sequelize.INTEGER,
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
      await queryInterface.dropTable('stagesOnOrders', { force: true });
   },
};
