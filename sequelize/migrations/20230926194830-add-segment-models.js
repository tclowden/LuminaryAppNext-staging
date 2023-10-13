'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // create a table for the segments model
      await queryInterface.createTable('segments', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: Sequelize.STRING,
         type: {
            type: Sequelize.ENUM('Static', 'Dynamic'),
            defaultValue: 'Dynamic',
            allowNull: false,
         },
         filter: Sequelize.JSONB,
         // Add userId
         userId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            // Set null on update or delete
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },

         createdAt: Sequelize.DATE,
         updatedAt: Sequelize.DATE,
         deletedAt: Sequelize.DATE,
      });
   },

   async down(queryInterface, Sequelize) {
      /**
       * Add reverting commands here.
       *
       * Example:
       * await queryInterface.dropTable('users');
       */
      // Drop both tables

      await queryInterface.dropTable('segments');
   },
};
