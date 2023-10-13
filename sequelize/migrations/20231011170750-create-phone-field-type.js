'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      const transaction = await queryInterface.sequelize.transaction();
      try {
         await queryInterface.bulkInsert(
            'fieldTypesLookup',
            [{ name: 'Phone Number', iconName: 'PhoneAngled', iconColor: 'green' }],
            { transaction }
         );

         await transaction.commit();
      } catch (err) {
         await transaction.rollback();
         throw err;
      }
   },

   async down(queryInterface, Sequelize) {
      const transaction = await queryInterface.sequelize.transaction();
      try {
         await queryInterface.bulkDelete(
            'fieldTypesLookup',
            {
               name: 'Phone Number',
               iconName: 'PhoneAngled',
               iconColor: 'green',
            },
            { transaction }
         );

         await transaction.commit();
      } catch (err) {
         await transaction.rollback();
         throw err;
      }
   },
};
