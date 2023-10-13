'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // change productTasks description type to TEXT from STRING... to handle longer strings
      await queryInterface.changeColumn('productTasks', 'description', {
         type: Sequelize.TEXT,
         allowNull: true,
      });

      await queryInterface.addColumn('tasksOnOrders', 'name', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.addColumn('tasksOnOrders', 'description', {
         type: Sequelize.TEXT,
         allowNull: true,
      });
      await queryInterface.addColumn('tasksOnOrders', 'dueAt', {
         type: Sequelize.DATE,
         allowNull: true,
      });
      await queryInterface.addColumn('tasksOnOrders', 'createdById', {
         type: Sequelize.UUID,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
         allowNull: true,
      });
      await queryInterface.addColumn('tasksOnOrders', 'updatedById', {
         type: Sequelize.UUID,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
         allowNull: true,
      });
      await queryInterface.addColumn('tasksOnOrders', 'completedById', {
         type: Sequelize.UUID,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('tasksOnOrders', 'name');
      await queryInterface.removeColumn('tasksOnOrders', 'description');
      await queryInterface.removeColumn('tasksOnOrders', 'dueAt');
      await queryInterface.removeColumn('tasksOnOrders', 'createdById');
      await queryInterface.removeColumn('tasksOnOrders', 'updatedById');
      await queryInterface.removeColumn('tasksOnOrders', 'completedById');

      await queryInterface.changeColumn('productTasks', 'description', {
         type: Sequelize.STRING,
         allowNull: true,
      });
   },
};
