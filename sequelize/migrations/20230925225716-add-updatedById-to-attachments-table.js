'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('attachments', 'updatedById', {
         type: Sequelize.UUID,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('attachments', 'updatedById');
   },
};
