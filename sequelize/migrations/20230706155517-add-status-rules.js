'use strict';

/***
 * CREATE statusRulesTypes and statusRules models
 *
 * INSERT @const statusRulesTypes data
 *
 * GET existing data from statuses, INSERT populate statusRules model
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      try {
         // CREATE statusRulesTypes and statusRules models
         await queryInterface.createTable('statusRulesTypes', {
            id: {
               type: Sequelize.UUID,
               primaryKey: true,
               allowNull: false,
               defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            name: {
               type: Sequelize.STRING,
            },
            description: {
               type: Sequelize.TEXT,
            },
            oldId: {
               type: Sequelize.INTEGER,
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
         });

         await queryInterface.createTable('statusMetaData', {
            id: {
               type: Sequelize.UUID,
               primaryKey: true,
               allowNull: false,
               defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            statusId: {
               type: Sequelize.UUID,
               references: {
                  model: 'statuses',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'CASCADE',
            },
            requiredNumberOfCalls: {
               type: Sequelize.INTEGER,
               defaultValue: 0,
               allowNull: false,
            },
            webhookUrl: {
               type: Sequelize.STRING,
               defaultValue: null,
               allowNull: true,
            },
            createdAt: {
               type: Sequelize.DATE,
               allowNull: false,
               defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            oldId: {
               type: Sequelize.INTEGER,
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
         });

         await queryInterface.createTable('rulesOnStatuses', {
            id: {
               type: Sequelize.UUID,
               primaryKey: true,
               allowNull: false,
               defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            statusId: {
               type: Sequelize.UUID,
               references: {
                  model: 'statuses',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'CASCADE',
            },
            statusRulesTypesId: {
               type: Sequelize.UUID,
               references: {
                  model: 'statusRulesTypes',
                  key: 'id',
               },
               onUpdate: 'CASCADE',
               onDelete: 'CASCADE',
            },
            oldId: {
               type: Sequelize.INTEGER,
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
         });
      } catch (err) {
         console.log(err);
      }
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('rulesOnStatuses');
      await queryInterface.dropTable('statusRulesTypes');
      await queryInterface.dropTable('statusMetaData');
   },
};
