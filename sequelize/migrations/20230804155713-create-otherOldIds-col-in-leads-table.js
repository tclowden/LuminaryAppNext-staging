'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('leads', 'otherOldIds', {
         type: Sequelize.ARRAY(Sequelize.INTEGER),
         allowNull: true,
         defaultValue: [],
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('leads', 'otherOldIds');
   },
};
