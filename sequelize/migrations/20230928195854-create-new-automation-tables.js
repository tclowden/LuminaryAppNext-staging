'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /**
       * Add altering commands here.
       *
       * Example:
       * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
       */

      await queryInterface.createTable('automations', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         type: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         segmentId: {
            type: Sequelize.UUID,
            references: {
               model: 'segments',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         triggers: {
            type: Sequelize.JSONB,
            allowNull: true,
         },
         actions: {
            type: Sequelize.JSONB,
            allowNull: true,
         },
         isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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

      // Lookup example
      // await queryInterface.createTable('automationStatusesLookup', {
      //    id: {
      //       type: Sequelize.UUID,
      //       primaryKey: true,
      //       allowNull: false,
      //       defaultValue: Sequelize.literal('uuid_generate_v4()'),
      //    },
      //    name: {
      //       type: Sequelize.STRING,
      //       allowNull: false,
      //    },
      //    oldId: {
      //       type: Sequelize.INTEGER,
      //    },
      //    createdAt: {
      //       type: Sequelize.DATE,
      //       allowNull: false,
      //       defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      //    },
      //    updatedAt: {
      //       type: Sequelize.DATE,
      //       allowNull: false,
      //       defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      //       onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      //    },
      //    deletedAt: {
      //       type: Sequelize.DATE,
      //       allowNull: true,
      //    },
      // })

      // await queryInterface.bulkInsert('automationStatusesLookup', [
      //    { name: 'success' },
      //    { name: 'failed' },
      //    { name: 'running' },
      //    { name: 'new' },
      //    { name: 'waiting' }
      // ])

      await queryInterface.createTable('automationRuns', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         automationId: {
            type: Sequelize.UUID,
            references: {
               model: 'automations',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
         },
         leadId: {
            type: Sequelize.UUID,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: true,
         },
         orderId: {
            type: Sequelize.UUID,
            references: {
               model: 'orders',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: true,
         },
         executorId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         trigger: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         previousVal: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         newVal: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         statusType: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         actionData: {
            type: Sequelize.JSONB,
            allowNull: true,
         },
         waitUntil: {
            type: Sequelize.DATE,
            allowNull: true,
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
   },

   async down(queryInterface, Sequelize) {
      /**
       * Add reverting commands here.
       *
       * Example:
       * await queryInterface.dropTable('users');
       */
      await queryInterface.dropTable('automationRuns', { force: true });
      await queryInterface.dropTable('automations', { force: true });
   }
};
