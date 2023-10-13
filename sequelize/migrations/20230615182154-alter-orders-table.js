'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('orders', 'utilityCompanyId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'utilityCompaniesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
      });

      await queryInterface.addColumn('orders', 'financierId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'financiersLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('orders', 'financierId');
      await queryInterface.removeColumn('orders', 'utilityCompanyId');
   },
};
