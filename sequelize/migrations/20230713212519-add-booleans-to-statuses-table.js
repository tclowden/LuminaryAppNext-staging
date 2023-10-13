"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn("statuses", "dncStatus", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "humanAnsweredStatus", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "scheduledStatus", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "bucketStatus", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "pipeStatus", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "hiddenStatus", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "askAppointmentOutcome", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "dplStatus", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "hideIfContacted", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
      await queryInterface.addColumn("statuses", "requireNumberCalls", {
         type: Sequelize.INTEGER,
         allowNull: false,
         defaultValue: 0,
      });
      await queryInterface.addColumn("statuses", "requireNote", {
         type: Sequelize.BOOLEAN,
         allowNull: false,
         defaultValue: false,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("statuses", "requireNote");
      await queryInterface.removeColumn("statuses", "requireNumberCalls");
      await queryInterface.removeColumn("statuses", "hideIfContacted");
      await queryInterface.removeColumn("statuses", "dplStatus");
      await queryInterface.removeColumn("statuses", "askAppointmentOutcome");
      await queryInterface.removeColumn("statuses", "hiddenStatus");
      await queryInterface.removeColumn("statuses", "pipeStatus");
      await queryInterface.removeColumn("statuses", "bucketStatus");
      await queryInterface.removeColumn("statuses", "scheduledStatus");
      await queryInterface.removeColumn("statuses", "humanAnsweredStatus");
      await queryInterface.removeColumn("statuses", "dncStatus");
   },
};
