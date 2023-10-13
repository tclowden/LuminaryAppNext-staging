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

      await queryInterface.addColumn('proposalQueue', 'leadId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'leads',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('proposalQueue', 'leadId');
   },
};
