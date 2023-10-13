'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('productStages', 'stageTypeId', {
         type: Sequelize.UUID,
         allowNull: true,
         references: {
            model: 'stageTypesLookup',
            key: 'id',
         },
         onUpdate: 'CASCADE',
         onDelete: 'CASCADE',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('productStages', 'stageTypeId');
   },
};
