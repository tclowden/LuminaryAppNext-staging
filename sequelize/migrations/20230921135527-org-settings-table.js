'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('orgSettings', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         yearToDateRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         sixWeekRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         monthlyRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         dailyRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         weeklyRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         dailyTalkTime: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         appointmentsSet: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         contractsSigned: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         leadsAllowedInPipe: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         dailyBucketGrabsLimit: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('orgSettings');
   },
};
