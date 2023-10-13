'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('orders', 'finalFundedAmount');
      await queryInterface.removeColumn('orders', 'finalFundedAt');
      await queryInterface.addColumn('orders', 'firstFundedAmount', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'firstFundedAt', {
         type: Sequelize.DATE,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('orders', 'firstFundedAmount');
      await queryInterface.removeColumn('orders', 'firstFundedAt');
      await queryInterface.addColumn('orders', 'finalFundedAmount', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'finalFundedAt', {
         type: Sequelize.DATE,
         allowNull: true,
      });
   },
};
