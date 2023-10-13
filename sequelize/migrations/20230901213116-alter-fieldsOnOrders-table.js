'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('fieldsOnOrders', 'fieldOnProductId', {
         type: Sequelize.UUID,
         references: {
            model: 'fieldsOnProducts',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('fieldsOnOrders', 'fieldOnProductId');
   },
};
