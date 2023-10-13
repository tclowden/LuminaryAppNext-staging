'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.changeColumn('smsLogs', 'leadId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'leads',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
      });
      await queryInterface.changeColumn('smsLogs', 'sentFromUserId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
      });
      await queryInterface.changeColumn('smsLogs', 'sentToUserId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'users',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.changeColumn('smsLogs', 'leadId', {
         type: Sequelize.UUID,
         allowNull: true,
      });
      await queryInterface.changeColumn('smsLogs', 'sentFromUserId', {
         type: Sequelize.UUID,
         allowNull: true,
      });
      await queryInterface.changeColumn('smsLogs', 'sentToUserId', {
         type: Sequelize.UUID,
         allowNull: true,
      });
   },
};
