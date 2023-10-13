'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('tasksOnOrders', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         taskOnProductId: {
            type: Sequelize.UUID,
            references: {
               model: 'tasksOnProducts',
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
         oldId: {
            type: Sequelize.INTEGER,
         },
         completedAt: {
            type: Sequelize.DATE,
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
      await queryInterface.dropTable('tasksOnOrders', { force: true });
   },
};
