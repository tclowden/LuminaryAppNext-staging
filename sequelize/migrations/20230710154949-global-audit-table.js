'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('auditLogs', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         table: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         rowId: {
            type: Sequelize.UUID,
            allowNull: false,
         },
         originalValue: {
            type: Sequelize.JSONB,
            allowNull: false,
         },
         newValue: {
            type: Sequelize.JSONB,
            allowNull: false,
         },
         modifiedById: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: false,
         },
         modifiedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('auditLogs', { force: true });
   },
};
