'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.dropTable('appointmentStatusesLookup', { force: true });
      await queryInterface.removeColumn('appointments', 'statusId');
      await queryInterface.createTable('appointmentTypesLookup', {
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
      await queryInterface.addColumn('appointments', 'appointmentTypeId', {
         type: Sequelize.UUID,
         references: {
            model: 'appointmentTypesLookup', // name of Target model
            key: 'id', // key in Target model that we're referencing
         },
         allowNull: true,
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
      // await queryInterface.addColumn('appointments', 'oldId', {
      //    type: Sequelize.INTEGER,
      //    allowNull: true,
      // });
      await queryInterface.addColumn('appointmentTypesLookup', 'oldId', {
         type: Sequelize.INTEGER,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      // await queryInterface.removeColumn('appointments', 'oldId');
      await queryInterface.removeColumn('appointmentTypesLookup', 'oldId');
      await queryInterface.dropTable('appointmentTypesLookup', { force: true });
      await queryInterface.removeColumn('appointments', 'appointmentTypeId');
      await queryInterface.createTable('appointmentStatusesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         type: {
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
      await queryInterface.addColumn('appointments', 'statusId', {
         type: Sequelize.UUID,
         references: {
            model: 'appointmentStatusesLookup', // name of Target model
            key: 'id', // key in Target model that we're referencing
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },
};
