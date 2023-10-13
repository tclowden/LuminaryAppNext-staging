'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /**
       * Add altering commands here.
       *
       * Example:
       * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
       */
      queryInterface.addColumn('proposalOptions', 'utilityCompanyId', {
         type: Sequelize.UUID,
         after: 'financierId',
         allowNull: true,
         references: {
            model: 'utilityCompaniesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
      });
   },

   async down(queryInterface, Sequelize) {
      queryInterface.removeColumn('proposalOptions', 'utilityCompanyId');
   },
};
