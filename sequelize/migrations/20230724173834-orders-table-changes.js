'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // PROPOSAL OPTIONS
      await queryInterface.addColumn('proposalOptions', 'selected', {
         type: Sequelize.BOOLEAN,
         defaultValue: false,
         allowNull: false,
      });

      // ORDERS
      await queryInterface.addColumn('orders', 'finalFundedAmount', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'secondFundedAmount', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'thirdFundedAmount', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'finalFundedAt', {
         type: Sequelize.DATE,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'secondFundedAt', {
         type: Sequelize.DATE,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'thirdFundedAt', {
         type: Sequelize.DATE,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'cityTax', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'stateTax', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'countyTax', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'dealerFee', {
         type: Sequelize.FLOAT,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'productStageId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'productStages',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
      await queryInterface.addColumn('orders', 'installAddress', {
         type: Sequelize.STRING,
         allowNull: true,
      });
      await queryInterface.addColumn('orders', 'installSignedDate', {
         type: Sequelize.DATE,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('orders', 'installSignedDate');
      await queryInterface.removeColumn('orders', 'installAddress');
      await queryInterface.removeColumn('orders', 'productStageId');
      await queryInterface.removeColumn('orders', 'dealerFee');
      await queryInterface.removeColumn('orders', 'countyTax');
      await queryInterface.removeColumn('orders', 'stateTax');
      await queryInterface.removeColumn('orders', 'cityTax');
      await queryInterface.removeColumn('orders', 'finalFundedAmount');
      await queryInterface.removeColumn('orders', 'secondFundedAmount');
      await queryInterface.removeColumn('orders', 'thirdFundedAmount');
      await queryInterface.removeColumn('orders', 'finalFundedAt');
      await queryInterface.removeColumn('orders', 'secondFundedAt');
      await queryInterface.removeColumn('orders', 'thirdFundedAt');
      await queryInterface.removeColumn('proposalOptions', 'selected');
   },
};
