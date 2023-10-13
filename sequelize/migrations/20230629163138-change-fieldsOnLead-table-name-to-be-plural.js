'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.renameTable('fieldsOnLead', 'fieldsOnLeads');
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.renameTable('fieldsOnLeads', 'fieldsOnLead');
   },
};
