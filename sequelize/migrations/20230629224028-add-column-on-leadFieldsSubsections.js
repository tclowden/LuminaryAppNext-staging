'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.addColumn('leadFieldsSubsections', 'sectionId', {
         type: Sequelize.UUID,
         references: {
            model: 'leadFieldsSections',
            key: 'id',
         },
         allowNull: true,
         onUpdate: 'CASCADE',
         onDelete: 'SET NULL',
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.removeColumn('leadFieldsSubsections', 'sectionId');
   },
};
