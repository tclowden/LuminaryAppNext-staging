'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('attachments', 'publicUrl', { force: true });
      await queryInterface.addColumn('attachments', 'publicUrl', {
         type: Sequelize.TEXT,
         allowNull: true,
      });

      await queryInterface.renameTable('attachmentTypes', 'attachmentTypesLookup');
      await queryInterface.removeColumn('attachmentTypesLookup', 'type', { force: true });
      await queryInterface.addColumn('attachmentTypesLookup', 'name', {
         type: Sequelize.STRING,
         allowNull: false,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('attachments', 'publicUrl', { force: true });
      await queryInterface.addColumn('attachments', 'publicUrl', {
         type: Sequelize.STRING,
         allowNull: true,
      });

      await queryInterface.renameTable('attachmentTypesLookup', 'attachmentTypes');
      await queryInterface.removeColumn('attachmentTypes', 'name', { force: true });
      await queryInterface.addColumn('attachmentTypes', 'type', {
         type: Sequelize.STRING,
         allowNull: false,
      });
   },
};
