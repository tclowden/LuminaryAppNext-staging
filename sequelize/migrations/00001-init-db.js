'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

      await queryInterface.createTable('offices', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
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
      await queryInterface.createTable('users', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         firstName: {
            type: Sequelize.STRING,
         },
         lastName: {
            type: Sequelize.STRING,
         },
         emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         preferredFirstName: {
            type: Sequelize.STRING,
         },
         passwordHash: {
            type: Sequelize.STRING,
         },
         phoneNumber: {
            type: Sequelize.STRING,
         },
         prefersDarkMode: {
            type: Sequelize.BOOLEAN,
         },
         profileUrl: {
            type: Sequelize.STRING,
         },
         officeId: {
            type: Sequelize.UUID,
            references: {
               model: 'offices',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('roles', {
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
         description: Sequelize.STRING,
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
      await queryInterface.createTable('appointmentStatusesLookup', {
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

      await queryInterface.createTable('bucketTypes', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         typeName: {
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
      await queryInterface.createTable('attachmentTypes', {
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

      await queryInterface.createTable('keyTypesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
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

      await queryInterface.createTable('fieldTypesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         iconName: {
            type: Sequelize.STRING,
         },
         iconColor: {
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

      await queryInterface.createTable('financiersLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         specialNotes: {
            type: Sequelize.TEXT,
         },
         hidden: {
            type: Sequelize.BOOLEAN,
         },
         pinned: {
            type: Sequelize.BOOLEAN,
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
      await queryInterface.createTable('leadSourceTypes', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         typeName: {
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
      });

      await queryInterface.createTable('netMeteringTypesLookup', {
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
      });

      await queryInterface.createTable('pagesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: Sequelize.STRING,
         iconName: Sequelize.STRING,
         iconColor: Sequelize.STRING,
         route: Sequelize.STRING,
         displayOrder: {
            type: Sequelize.INTEGER,
            allowNull: false,
         },
         showOnSidebar: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         parentPageId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'pagesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('permissionTagsLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
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

      await queryInterface.createTable('productsLookup', {
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
            type: Sequelize.STRING,
         },
         iconName: {
            type: Sequelize.STRING,
         },
         iconColor: {
            type: Sequelize.STRING,
         },
         primary: {
            type: Sequelize.BOOLEAN,
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

      await queryInterface.createTable('stageTypesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
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

      await queryInterface.createTable('statusTypes', {
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
      });

      await queryInterface.createTable('teamTypesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
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

      await queryInterface.createTable('statesLookup', {
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
         abbreviation: {
            type: Sequelize.STRING,
            allowNull: false,
         },
         supported: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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

      await queryInterface.createTable('utilityCompaniesLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         specialNotes: {
            type: Sequelize.TEXT,
         },
         netMeter: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         connectionFee: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: '0.00',
         },
         additionalCost: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: '0.00',
         },
         stateId: {
            type: Sequelize.UUID,
            references: {
               model: 'statesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         netMeteringTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'netMeteringTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('configuredListsLookup', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         tableName: {
            type: Sequelize.STRING,
         },
         keyPath: {
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

      await queryInterface.createTable('statuses', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         archived: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         typeId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'statusTypes',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('leadSources', {
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
         endpoint: {
            type: Sequelize.STRING,
         },
         typeId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'leadSourceTypes',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('statusScreenConfigs', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
            allowNull: true,
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

      await queryInterface.createTable('leads', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         ownerId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         createdById: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         setterAgentId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         statusId: {
            type: Sequelize.UUID,
            references: {
               model: 'statuses',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         leadSourceId: {
            type: Sequelize.UUID,
            references: {
               model: 'leadSources',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         isAvailableInQueue: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
         },
         firstName: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         lastName: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         phoneNumber: {
            type: Sequelize.STRING(12),
            allowNull: false,
            unique: true,
         },
         phoneVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         callCount: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
         },
         emailAddress: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
         },
         emailVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         streetAddress: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         city: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         state: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         zipCode: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         latitude: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         longitude: {
            type: Sequelize.STRING,
            allowNull: true,
         },
         addressVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         archived: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
      });

      await queryInterface.createTable('buckets', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         isDefaultBucket: {
            type: Sequelize.BOOLEAN,
         },
         isActive: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         bucketTypeId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'bucketTypes', // name of the referenced table
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         leadSourceIds: {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
            defaultValue: [],
         },
         statusIds: {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
            defaultValue: [],
         },
         userIds: {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
            defaultValue: [],
         },
         orderCriteria: {
            type: Sequelize.JSONB,
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
      });

      await queryInterface.createTable('appointments', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         appointmentTime: {
            type: Sequelize.DATE,
         },
         kept: {
            type: Sequelize.BOOLEAN,
         },
         leadId: {
            type: Sequelize.UUID,
            references: {
               model: 'leads', // name of Target model
               key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         statusId: {
            type: Sequelize.UUID,
            references: {
               model: 'appointmentStatusesLookup', // name of Target model
               key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         createdById: {
            type: Sequelize.UUID,
            references: {
               model: 'users', // name of Target model
               key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         assignedRepId: {
            type: Sequelize.UUID,
            references: {
               model: 'users', // name of Target model
               key: 'id', // key in Target model that we're referencing
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('orders', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         ownerId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         createdById: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         productId: {
            type: Sequelize.UUID,
            references: {
               model: 'productsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         leadId: {
            type: Sequelize.UUID,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('attachments', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         filePath: {
            type: Sequelize.STRING,
         },
         fileName: {
            type: Sequelize.STRING,
         },
         fileNickName: {
            type: Sequelize.STRING,
         },
         publicUrl: {
            type: Sequelize.STRING,
         },
         attachmentTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'attachmentTypes',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         leadId: {
            type: Sequelize.UUID,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         orderId: {
            type: Sequelize.UUID,
            references: {
               model: 'orders',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         userId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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
      });

      await queryInterface.createTable('leadFieldsSubsections', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         displayOrder: {
            type: Sequelize.INTEGER,
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

      await queryInterface.createTable('leadFieldsSections', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         editable: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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

      await queryInterface.createTable('leadFields', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         label: {
            type: Sequelize.STRING,
         },
         placeholder: {
            type: Sequelize.STRING,
         },
         required: {
            type: Sequelize.BOOLEAN,
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         subsectionId: {
            type: Sequelize.UUID,
            references: {
               model: 'leadFieldsSubsections',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         fieldTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'fieldTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('fieldsOnLead', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         answer: {
            type: Sequelize.STRING,
         },
         leadId: {
            type: Sequelize.UUID,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         leadFieldId: {
            type: Sequelize.UUID,
            references: {
               model: 'leadFields',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('productFields', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         label: {
            type: Sequelize.STRING,
         },
         placeholder: {
            type: Sequelize.STRING,
         },
         fieldTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'fieldTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         configuredListId: {
            type: Sequelize.UUID,
            references: {
               model: 'configuredListsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('productStages', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
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

      await queryInterface.createTable('stagesOnProducts', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         required: {
            type: Sequelize.BOOLEAN,
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         scheduledStage: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         daysToComplete: {
            type: Sequelize.INTEGER,
         },
         createdById: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         productStageId: {
            type: Sequelize.UUID,
            references: {
               model: 'productStages',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         productId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'productsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('fieldsOnProducts', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         required: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         hidden: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         hideOnCreate: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         productFieldId: {
            type: Sequelize.UUID,
            references: {
               model: 'productFields',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         productId: {
            type: Sequelize.UUID,
            references: {
               model: 'productsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         stageOnProductConstraintId: {
            type: Sequelize.UUID,
            references: {
               model: 'stagesOnProducts',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('fieldsOnOrders', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         answer: {
            type: Sequelize.STRING,
         },
         fieldOnProductId: {
            type: Sequelize.UUID,
            references: {
               model: 'fieldsOnProducts',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         orderId: {
            type: Sequelize.UUID,
            references: {
               model: 'orders',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('leadFieldOptions', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         value: {
            type: Sequelize.STRING,
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         leadFieldId: {
            type: Sequelize.UUID,
            references: {
               model: 'leadFields',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('notes', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         content: {
            type: Sequelize.TEXT,
         },
         pinned: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         createdById: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         leadId: {
            type: Sequelize.UUID,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         orderId: {
            type: Sequelize.UUID,
            references: {
               model: 'orders',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('permissions', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: Sequelize.STRING,
         description: Sequelize.STRING,
         isDefaultPermission: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         pageId: {
            type: Sequelize.UUID,
            references: {
               model: 'pagesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('permissionsOnRoles', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         permissionId: {
            type: Sequelize.UUID,
            references: {
               model: 'permissions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         roleId: {
            type: Sequelize.UUID,
            references: {
               model: 'roles',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('permissionTagsOnPermissions', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         permissionId: {
            type: Sequelize.UUID,
            references: {
               model: 'permissions',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         permissionTagId: {
            type: Sequelize.UUID,
            references: {
               model: 'permissionTagsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('productCoordinators', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
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

      await queryInterface.createTable('productFieldOptions', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         value: {
            type: Sequelize.STRING,
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         productFieldId: {
            type: Sequelize.UUID,
            references: {
               model: 'productFields',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('productTasks', {
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

      await queryInterface.createTable('rolesOnProductCoordinators', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         productCoordinatorId: {
            type: Sequelize.UUID,
            references: {
               model: 'productCoordinators',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         roleId: {
            type: Sequelize.UUID,
            references: {
               model: 'roles',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('rolesOnUsers', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         userId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         roleId: {
            type: Sequelize.UUID,
            references: {
               model: 'roles',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('stageOnProductRoleConstraints', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         roleId: {
            type: Sequelize.UUID,
            references: {
               model: 'roles',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         stageOnProductConstraintId: {
            type: Sequelize.UUID,
            references: {
               model: 'stagesOnProducts',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('statusHistory', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         statusId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'statuses',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         leadId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'leads',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         userId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('taskDueDateTypesLookup', {
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

      await queryInterface.createTable('tasksOnProducts', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         displayOrder: {
            type: Sequelize.INTEGER,
         },
         stageOnProductConstraintId: {
            type: Sequelize.UUID,
            references: {
               model: 'stagesOnProducts',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         productTaskId: {
            type: Sequelize.UUID,
            references: {
               model: 'productTasks',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         productId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'productsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         taskDueDateTypesLookupId: {
            type: Sequelize.UUID,
            references: {
               model: 'taskDueDateTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('teams', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: Sequelize.STRING,
         },
         teamTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'teamTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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

      await queryInterface.createTable('teamsProducts', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         teamId: {
            type: Sequelize.UUID,
            references: {
               model: 'teams',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         productId: {
            type: Sequelize.UUID,
            references: {
               model: 'productsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('teamsUsers', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         teamLead: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
         },
         teamId: {
            type: Sequelize.UUID,
            references: {
               model: 'teams',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         userId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('usersKeys', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         value: {
            type: Sequelize.STRING,
         },
         expiration: {
            type: Sequelize.DATE,
         },
         keyTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'keyTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         userId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('coordinatorsOnProducts', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         productCoordinatorId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'productCoordinators',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         productId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
               model: 'productsLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
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

      await queryInterface.createTable('getNextLeadHistory', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         leadId: {
            type: Sequelize.UUID,
            references: {
               model: 'leads', // name of the related model
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         bucketId: {
            type: Sequelize.UUID,
            references: {
               model: 'buckets', // name of the related model
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
         },
         userId: {
            type: Sequelize.UUID,
            references: {
               model: 'users', // name of the related model
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('offices', { force: true });
      await queryInterface.dropTable('users', { force: true });
      await queryInterface.dropTable('roles', { force: true });
      await queryInterface.dropTable('appointmentStatusesLookup', { force: true });
      await queryInterface.dropTable('bucketTypes', { force: true });
      await queryInterface.dropTable('attachmentTypes', { force: true });
      await queryInterface.dropTable('keyTypesLookup', { force: true });
      await queryInterface.dropTable('fieldTypesLookup', { force: true });
      await queryInterface.dropTable('financiersLookup', { force: true });
      await queryInterface.dropTable('leadSourceTypes', { force: true });
      await queryInterface.dropTable('netMeteringTypesLookup', { force: true });
      await queryInterface.dropTable('pagesLookup', { force: true });
      await queryInterface.dropTable('permissionTagsLookup', { force: true });
      await queryInterface.dropTable('productsLookup', { force: true });
      await queryInterface.dropTable('stageTypesLookup', { force: true });
      await queryInterface.dropTable('statusTypes', { force: true });
      await queryInterface.dropTable('teamTypesLookup', { force: true });
      await queryInterface.dropTable('statesLookup', { force: true });
      await queryInterface.dropTable('utilityCompaniesLookup', { force: true });
      await queryInterface.dropTable('configuredListsLookup', { force: true });
      await queryInterface.dropTable('statuses', { force: true });
      await queryInterface.dropTable('leadSources', { force: true });
      await queryInterface.dropTable('leads', { force: true });
      await queryInterface.dropTable('buckets', { force: true });
      await queryInterface.dropTable('appointments', { force: true });
      await queryInterface.dropTable('orders', { force: true });
      await queryInterface.dropTable('attachments', { force: true });
      await queryInterface.dropTable('leadFieldsSubsections', { force: true });
      await queryInterface.dropTable('leadFieldsSections', { force: true });
      await queryInterface.dropTable('leadFields', { force: true });
      await queryInterface.dropTable('fieldsOnLead', { force: true });
      await queryInterface.dropTable('productFields', { force: true });
      await queryInterface.dropTable('productStages', { force: true });
      await queryInterface.dropTable('stagesOnProducts', { force: true });
      await queryInterface.dropTable('fieldsOnProducts', { force: true });
      await queryInterface.dropTable('fieldsOnOrders', { force: true });
      await queryInterface.dropTable('leadFieldOptions', { force: true });
      await queryInterface.dropTable('notes', { force: true });
      await queryInterface.dropTable('permissions', { force: true });
      await queryInterface.dropTable('permissionsOnRoles', { force: true });
      await queryInterface.dropTable('permissionTagsOnPermissions', { force: true });
      await queryInterface.dropTable('productCoordinators', { force: true });
      await queryInterface.dropTable('productFieldOptions', { force: true });
      await queryInterface.dropTable('productTasks', { force: true });
      await queryInterface.dropTable('rolesOnProductCoordinators', { force: true });
      await queryInterface.dropTable('rolesOnUsers', { force: true });
      await queryInterface.dropTable('stageOnProductRoleConstraints', { force: true });
      await queryInterface.dropTable('statusHistory', { force: true });
      await queryInterface.dropTable('taskDueDateTypesLookup', { force: true });
      await queryInterface.dropTable('tasksOnProducts', { force: true });
      await queryInterface.dropTable('teams', { force: true });
      await queryInterface.dropTable('teamsProducts', { force: true });
      await queryInterface.dropTable('teamsUsers', { force: true });
      await queryInterface.dropTable('usersKeys', { force: true });
      await queryInterface.dropTable('coordinatorsOnProducts', { force: true });
      await queryInterface.dropTable('getNextLeadHistory', { force: true });
      await queryInterface.dropTable('statusScreenConfigs', { force: true });

      await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp";');
   },
};
