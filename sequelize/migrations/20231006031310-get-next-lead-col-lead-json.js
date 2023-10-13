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

      // add a jsonb column to the getNextLeadHistory table
      await queryInterface.addColumn('getNextLeadHistory', 'leadJson', {
         type: Sequelize.DataTypes.JSONB,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      /**
       * Add reverting commands here.
       *
       * Example:
       * await queryInterface.dropTable('users');
       */
      await queryInterface.removeColumn('getNextLeadHistory', 'leadJson');
   },
};
