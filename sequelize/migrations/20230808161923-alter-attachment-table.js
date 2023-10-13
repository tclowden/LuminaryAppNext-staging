'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('attachments', 'userId');
      await queryInterface.addColumn('attachments', 'userId', {
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
      await queryInterface.removeColumn('attachments', 'userId');
      await queryInterface.addColumn('attachments', 'userId', {
         type: Sequelize.UUID,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
         allowNull: false,
      });
   },
};
