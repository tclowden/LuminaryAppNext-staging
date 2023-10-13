'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      const transaction = await queryInterface.sequelize.transaction();
      try {
         await queryInterface.createTable(
            'callRouteTypesLookup',
            {
               id: {
                  type: Sequelize.UUID,
                  primaryKey: true,
                  allowNull: false,
                  defaultValue: Sequelize.literal('uuid_generate_v4()'),
               },
               name: {
                  type: Sequelize.STRING,
                  allowNull: false,
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
               deletedAt: {
                  type: Sequelize.DATE,
                  allowNull: true,
               },
            },
            { transaction }
         );

         await queryInterface.bulkInsert(
            'callRouteTypesLookup',
            [
               { id: 'effeae2e-b875-4508-b7c4-41a390c8d85f', name: 'Phone Number' },
               { id: 'aa8deed6-1bb5-4de1-b387-033e68c34c49', name: 'Status' },
            ],
            { transaction }
         );

         await queryInterface.addColumn(
            'callRoutes',
            'typeId',
            {
               type: Sequelize.UUID,
               references: {
                  model: 'callRouteTypesLookup',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'SET NULL',
               allowNull: true, // Set as nullable initially until I update current rows, and THEN I will set it as required
            },
            { transaction }
         );

         // All existing rows (callRoutes) were created with what is now called the 'Phone Number' type. This query uses that id to update all existing callRoute typeId's
         await queryInterface.sequelize.query(
            `UPDATE "callRoutes" SET "typeId" = 'effeae2e-b875-4508-b7c4-41a390c8d85f' WHERE "typeId" IS NULL;`,
            { transaction }
         );

         // Now setting column to be required. Doing this avoids this error ->`column "typeId" of relation "callRoutes" contains null values`
         await queryInterface.changeColumn(
            'callRoutes',
            'typeId',
            {
               type: Sequelize.UUID,
               references: {
                  model: 'callRouteTypesLookup',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'SET NULL',
               allowNull: false,
            },
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
         await queryInterface.dropTable('callRouteTypesLookup', { force: true }, { transaction });
         await queryInterface.removeColumn('callRoutes', 'typeId', { transaction });

         await transaction.commit();
      } catch (err) {
         await transaction.rollback();
         throw err;
      }
   },
};
