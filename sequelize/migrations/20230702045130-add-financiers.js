'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('financiersLookup', 'loanTermInYears', {
         type: Sequelize.INTEGER,
         allowNull: true,
      });

      await queryInterface.addColumn('financiersLookup', 'interestRate', {
         type: Sequelize.DOUBLE,
         allowNull: true,
      });

      await queryInterface.addColumn('financiersLookup', 'dealerFee', {
         type: Sequelize.DOUBLE,
         allowNull: true,
      });

      await queryInterface.addColumn('financiersLookup', 'paymentFactorOne', {
         type: Sequelize.DOUBLE,
         allowNull: true,
      });

      await queryInterface.addColumn('financiersLookup', 'paymentFactorTwo', {
         type: Sequelize.DOUBLE,
         allowNull: true,
      });

      await queryInterface.addColumn('proposalOptionFinancingInformations', 'financierId', {
         type: Sequelize.UUID,
         allowNull: false,
      });
      await queryInterface.removeColumn('proposalOptionFinancingInformations', 'loanProductId');

      await queryInterface.bulkInsert('financiersLookup', [
         {
            name: 'Cash',
            loanTermInYears: 0,
            interestRate: 0,
            dealerFee: 0,
            paymentFactorOne: 0,
            paymentFactorTwo: 0,
            specialNotes: "Cold hard cash, there's a discount",
         },
         {
            name: 'Divident - 10 Year 2.99%',
            loanTermInYears: 10,
            interestRate: 2.99,
            dealerFee: 0.25,
            paymentFactorOne: 0.006936,
            paymentFactorTwo: 0.0102122,
            specialNotes: 'First',
         },
         {
            name: 'Divident - 10 Year 2.99%',
            loanTermInYears: 10,
            interestRate: 3.99,
            dealerFee: 0.27,
            paymentFactorOne: 0.0073148,
            paymentFactorTwo: 0.0107292,
            specialNotes: 'Second',
         },
      ]);
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('financiersLookup', 'loanTermInYears');

      await queryInterface.removeColumn('financiersLookup', 'interestRate');

      await queryInterface.removeColumn('financiersLookup', 'dealerFee');

      await queryInterface.removeColumn('financiersLookup', 'paymentFactorOne');

      await queryInterface.removeColumn('financiersLookup', 'paymentFactorTwo');

      await queryInterface.addColumn('proposalOptionFinancingInformations', 'loanProductId', {
         type: Sequelize.UUID,
         allowNull: false,
      });
   },
};
