'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.sequelize.transaction(async (transaction) => {

         await queryInterface.addColumn('productsLookup', 'proposalSupported', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         });

         await queryInterface.bulkUpdate(
            'productsLookup',
            { proposalSupported: true }, // 't' in PostgreSQL is boolean true
            {
               name: {
                  [Sequelize.Op.in]: ['Solar', 'Battery', 'Energy Efficiency', 'HVAC'],
               },
            },
            { transaction }
         );
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.sequelize.transaction(async (transaction) => {
         await queryInterface.bulkUpdate(
            'productsLookup',
            { proposalSupported: false }, // 'f' in PostgreSQL is boolean false
            {
               name: {
                  [Sequelize.Op.in]: ['Solar', 'Battery', 'Energy Efficiency', 'HVAC'],
               },
            },
            { transaction }
         );
      });
   },
};
