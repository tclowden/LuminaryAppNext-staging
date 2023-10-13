'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // Add a new column createdById to the installAppointments table, references users.id

      await queryInterface.addColumn('installAppointments', 'createdById', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'users',
            key: 'id',
         },
      });
   },

   async down(queryInterface, Sequelize) {
      // Remove the column createdById from the installAppointments table

      await queryInterface.removeColumn('installAppointments', 'createdById');
   },
};
