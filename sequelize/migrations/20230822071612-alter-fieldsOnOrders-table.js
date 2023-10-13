'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn('fieldsOnOrders', 'fieldOnProductId');
      await queryInterface.addColumn('fieldsOnOrders', 'productFieldId', {
         type: Sequelize.UUID,
         references: {
            model: 'productFields',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
         allowNull: true,
      });

      await queryInterface.removeColumn('fieldsOnOrders', 'answer');
      await queryInterface.addColumn('fieldsOnOrders', 'answer', {
         type: Sequelize.TEXT,
         allowNull: true,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('fieldsOnOrders', 'fieldOnProductId');
      await queryInterface.addColumn('fieldsOnOrders', 'answer', {
         type: Sequelize.STRING,
      });

      await queryInterface.removeColumn('fieldsOnOrders', 'productFieldId');
      await queryInterface.addColumn('fieldsOnOrders', 'fieldOnProductId', {
         type: Sequelize.UUID,
         references: {
            model: 'productFields',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },
};
