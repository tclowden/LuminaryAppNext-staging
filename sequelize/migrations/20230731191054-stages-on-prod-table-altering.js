'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('stagesOnProducts', 'timeline', {
         type: Sequelize.BIGINT,
         allowNull: true,
      });
      await queryInterface.removeColumn('stagesOnProducts', 'scheduledStage');
      await queryInterface.addColumn('stagesOnProducts', 'scheduled', {
         type: Sequelize.BOOLEAN,
         allowNull: true,
         defaultValue: false,
      });
      // await queryInterface.addColumn('stagesOnProducts', 'beginning', {
      //    type: Sequelize.BOOLEAN,
      //    allowNull: true,
      //    defaultValue: false,
      // });
   },

   async down(queryInterface, Sequelize) {
      // await queryInterface.removeColumn('stagesOnProducts', 'beginning');
      await queryInterface.removeColumn('stagesOnProducts', 'scheduled');
      await queryInterface.addColumn('stagesOnProducts', 'scheduledStage', {
         type: Sequelize.BOOLEAN,
         allowNull: true,
         defaultValue: false,
      });
      await queryInterface.removeColumn('stagesOnProducts', 'timeline');
   },
};
