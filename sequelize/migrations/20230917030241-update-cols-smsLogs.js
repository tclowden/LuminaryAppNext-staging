'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // update smsLogs table mmsUrls column to be nullable
      await queryInterface.changeColumn('smsLogs', 'mmsUrls', {
         type: Sequelize.ARRAY(Sequelize.STRING),
         allowNull: true,
      });
      await queryInterface.changeColumn('smsLogs', 'body', {
         type: Sequelize.TEXT,
         allowNull: true,
      });

      // Add deliveryStatus column to smsLogs table
      await queryInterface.addColumn('smsLogs', 'deliveryStatus', {
         type: Sequelize.STRING,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      // revert smsLogs table mmsUrls column to be non-nullable
      await queryInterface.changeColumn('smsLogs', 'mmsUrls', {
         type: Sequelize.ARRAY(Sequelize.STRING),
         allowNull: false,
      });
      await queryInterface.changeColumn('smsLogs', 'body', {
         type: Sequelize.TEXT,
         allowNull: false,
      });

      // remove status column from smsLogs table
      await queryInterface.removeColumn('smsLogs', 'deliveryStatus');
   },
};
