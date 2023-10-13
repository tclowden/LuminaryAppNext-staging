'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('statusesOnCallRoutes', {
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
         statusId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'statuses',
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

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('statusesOnCallRoutes', { force: true });
   },
};
