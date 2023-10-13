'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      const tables = await queryInterface.sequelize.query(
         `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
      );
      for (const tableArr of tables) {
         const table = tableArr[0];
         if (table == 'SequelizeMeta') {
            console.log('Skipping SequelizeMeta Table');
         } else {
            const archivedColExists = await queryInterface.sequelize.query(
               `SELECT column_name FROM information_schema.columns WHERE table_name='${table}' AND column_name='archived' `
            );
            const deletedAtColExists = await queryInterface.sequelize.query(
               `SELECT column_name FROM information_schema.columns WHERE table_name='${table}' AND column_name='deletedAt' `
            );
            if (archivedColExists[0]?.length) await queryInterface.removeColumn(table, 'archived');

            if (!deletedAtColExists[0]?.length) {
               await queryInterface.addColumn(table, 'deletedAt', {
                  type: Sequelize.DATE,
                  allowNull: true,
               });
            }
         }
      }
   },

   async down(queryInterface, Sequelize) {
      const tables = await queryInterface.sequelize.query(
         `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
      );
      for (const tableArr of tables) {
         const table = tableArr[0];
         if (table == 'SequelizeMeta') {
            console.log('Skipping SequelizeMeta Table');
         } else {
            const archivedColExists = await queryInterface.sequelize.query(
               `SELECT column_name FROM information_schema.columns WHERE table_name='${table}' AND column_name='archived' `
            );

            const deletedAtColExists = await queryInterface.sequelize.query(
               `SELECT column_name FROM information_schema.columns WHERE table_name='${table}' AND column_name='deletedAt' `
            );

            if (deletedAtColExists[0]?.length) await queryInterface.removeColumn(table, 'deletedAt');

            if (!archivedColExists[0]?.length) {
               await queryInterface.addColumn(table, 'archived', {
                  type: Sequelize.BOOLEAN,
                  allowNull: false,
                  defaultValue: false,
               });
            }
         }
      }
   },
};
