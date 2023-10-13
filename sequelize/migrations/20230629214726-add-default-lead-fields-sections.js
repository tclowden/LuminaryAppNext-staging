'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // add default leadFieldsSections
      await queryInterface.bulkInsert('leadFieldsSections', [
         {
            id: 'f791dcfa-c40e-49f1-9143-41c61d175dd0',
            name: 'Customer Information',
            displayOrder: 1,
            editable: true,
         },
         {
            id: 'd50e9c66-e68f-4078-92e6-c1007fa5541e',
            name: 'Notes & Attachments',
            displayOrder: 2,
         },
         {
            id: 'b69283a9-6e48-465c-849f-562e15a4e20d',
            name: 'General Information',
            displayOrder: 3,
            editable: true,
         },
         {
            id: 'cc0ac4ec-4feb-4152-8112-9ba16cd95d5c',
            name: 'Orders',
            displayOrder: 4,
         },
         {
            id: '1026237f-1a09-44b1-ab8e-31b717c5a827',
            name: 'Proposals',
            displayOrder: 5,
         },
         {
            id: 'ab6423f2-89c9-4718-a934-a145bc7a5e5d',
            name: 'Appointments',
            displayOrder: 6,
         },
         {
            id: '86b3c538-5bbf-4777-8880-7dc28f4420cc',
            name: 'Call Logs',
            displayOrder: 7,
         },
      ]);
   },

   async down(queryInterface, Sequelize) {
      // remove default leadFieldsSections
      await queryInterface.bulkDelete('leadFieldsSections', null, {});
   },
};
