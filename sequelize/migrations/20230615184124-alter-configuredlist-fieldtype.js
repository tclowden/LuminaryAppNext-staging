'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // update the name
      await queryInterface.bulkUpdate('fieldTypesLookup', { name: 'Configurable List' }, { name: 'Configured List' });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.bulkUpdate('fieldTypesLookup', { name: 'Configured List' }, { name: 'Configurable List' });
   },
};
