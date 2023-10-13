'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // will replace 'userId'
      await queryInterface.addColumn('attachments', 'createdById', {
         type: Sequelize.UUID,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('attachments', 'createdById');
   },
};
