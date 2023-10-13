'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('proposalTypesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         type: {
            type: Sequelize.STRING,
         },
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
         updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
      });

      queryInterface.bulkInsert('proposalTypesLookup', [
         {
            type: 'Residential',
         },
         {
            type: 'Commercial',
         },
      ]);
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('proposalTypesLookup', {
         force: true,
      });
   },
};
