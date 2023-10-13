'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('productFields', 'whereCondition', {
         type: Sequelize.JSONB,
         allowNull: true,
      });
      await queryInterface.addColumn('leadFields', 'whereCondition', {
         type: Sequelize.JSONB,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('leadFields', 'whereCondition');
      await queryInterface.removeColumn('productFields', 'whereCondition');
   },
};
