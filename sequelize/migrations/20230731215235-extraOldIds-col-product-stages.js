'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('productStages', 'otherOldIds', {
         type: Sequelize.ARRAY(Sequelize.INTEGER),
         allowNull: true,
         defaultValue: [],
      });
      await queryInterface.addColumn('productTasks', 'otherOldIds', {
         type: Sequelize.ARRAY(Sequelize.INTEGER),
         allowNull: true,
         defaultValue: [],
      });
      await queryInterface.addColumn('productCoordinators', 'otherOldIds', {
         type: Sequelize.ARRAY(Sequelize.INTEGER),
         allowNull: true,
         defaultValue: [],
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('productCoordinators', 'otherOldIds');
      await queryInterface.removeColumn('productTasks', 'otherOldIds');
      await queryInterface.removeColumn('productStages', 'otherOldIds');
   },
};
