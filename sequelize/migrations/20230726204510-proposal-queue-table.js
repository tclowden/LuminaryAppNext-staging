'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('proposalStatusTypesLookup', {
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalRequirementsLookup', {
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalQueue', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         ownerId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         dueAt: {
            type: Sequelize.DATE,
            allowNull: true,
         },
         submittedToSolo: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         completedById: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         proposalStatusId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalStatusTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         assignedToId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         assignedById: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         assignedAt: {
            type: Sequelize.DATE,
            allowNull: true,
         },
         revisionRequestedById: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         revisionRequestedAt: {
            type: Sequelize.DATE,
            allowNull: true,
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
         oldId: Sequelize.INTEGER,
      });

      await queryInterface.createTable('proposalQueueNotes', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         proposalQueueId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'proposalQueue',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         notes: {
            type: Sequelize.TEXT,
            allowNull: false,
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
         oldId: Sequelize.INTEGER,
      });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('proposalQueueNotes', { force: true });
      await queryInterface.dropTable('proposalQueue', { force: true });
      await queryInterface.dropTable('proposalRequirementsLookup', { force: true });
      await queryInterface.dropTable('proposalStatusTypesLookup', { force: true });
   },
};
