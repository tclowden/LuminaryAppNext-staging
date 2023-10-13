'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('leads', 'emailAddress');
      await queryInterface.addColumn('leads', 'emailAddress', {
         type: Sequelize.STRING,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('leads', 'emailAddress');
      await queryInterface.addColumn('leads', 'emailAddress', {
         type: Sequelize.STRING,
         allowNull: true,
         unique: true,
      });
   },
};
