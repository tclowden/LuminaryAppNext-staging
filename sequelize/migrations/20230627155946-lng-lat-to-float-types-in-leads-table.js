'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('leads', 'longitude');
      await queryInterface.removeColumn('leads', 'latitude');
      await queryInterface.addColumn('leads', 'longitude', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('leads', 'latitude', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('leads', 'longitude');
      await queryInterface.removeColumn('leads', 'latitude');
      await queryInterface.addColumn('leads', 'longitude', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.addColumn('leads', 'latitude', {
         type: Sequelize.STRING,
         allowNull: true,
      });
   },
};
