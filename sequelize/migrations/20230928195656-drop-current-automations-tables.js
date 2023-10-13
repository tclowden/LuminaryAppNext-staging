'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.dropTable('automationActionsOnAutomations', { force: true });
      await queryInterface.dropTable('automationActions', { force: true });
      await queryInterface.dropTable('automationTriggersOnAutomations', { force: true });
      await queryInterface.dropTable('automationTriggers', { force: true });
      await queryInterface.dropTable('automationSegments', { force: true });
      await queryInterface.dropTable('automationRuns', { force: true });
      await queryInterface.dropTable('automations', { force: true });
      await queryInterface.dropTable('automationStatusLookup', { force: true });
      await queryInterface.dropTable('automationTypesLookup', { force: true });
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.createTable('automationTypesLookup', {
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

      await queryInterface.createTable('automationStatusLookup', {
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

      await queryInterface.createTable('automations', {
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
         description: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         automationTypeId: {
            type: Sequelize.ARRAY(Sequelize.UUID),
            // references: {
            //    model: 'automationTypesLookup',
            //    key: 'id',
            // },
            // onUpdate: 'CASCADE',
            // onDelete: 'SET NULL',
            allowNull: true,
         },
         createdById: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         updatedById: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
            onDelete: 'SET NULL',
            allowNull: true,
         },
         automationStatusId: {
            type: Sequelize.UUID,
            references: {
               model: 'automationStatusLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         message: {
            type: Sequelize.TEXT,
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

      await queryInterface.createTable('automationSegments', {
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

      await queryInterface.createTable('automationTriggers', {
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
         automationTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'automationTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
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

      await queryInterface.createTable('automationTriggersOnAutomations', {
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
         automationTriggerId: {
            type: Sequelize.UUID,
            references: {
               model: 'automationTriggers',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
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

      await queryInterface.createTable('automationActions', {
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
         automationTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'automationTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
         },
         // automationId: {
         //    type: Sequelize.UUID,
         //    references: {
         //       model: 'automations',
         //       key: 'id',
         //    },
         //    onUpdate: 'CASCADE',
         //    onDelete: 'CASCADE',
         //    allowNull: false,
         // },
         // order: {
         //    type: Sequelize.INTEGER,
         //    allowNull: false,
         // },
         // input: {
         //    type: Sequelize.JSONB,
         //    allowNull: true,
         // },
         // options: {
         //    type: Sequelize.JSONB,
         //    allowNull: true,
         // },
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

      console.log('CREATING!!');
      await queryInterface.createTable('automationActionsOnAutomations', {
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
         automationActionId: {
            type: Sequelize.UUID,
            references: {
               model: 'automationActions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
         },
         order: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         input: {
            type: Sequelize.JSONB,
            allowNull: true,
         },
         options: {
            type: Sequelize.JSONB,
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
   }

};
