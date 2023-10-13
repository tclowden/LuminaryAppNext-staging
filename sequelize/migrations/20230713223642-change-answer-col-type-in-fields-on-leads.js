"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn("fieldsOnLeads", "answer");
      await queryInterface.addColumn("fieldsOnLeads", "answer", {
         type: Sequelize.TEXT,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn("fieldsOnLeads", "answer");
      await queryInterface.addColumn("fieldsOnLeads", "answer", {
         type: Sequelize.STRING,
         allowNull: true,
      });
   },
};
