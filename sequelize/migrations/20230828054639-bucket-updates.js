'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      // Alter the existing buckets table to remove old columns and add new ones
      await queryInterface.removeColumn('buckets', 'leadSourceIds');
      await queryInterface.removeColumn('buckets', 'statusIds');
      await queryInterface.removeColumn('buckets', 'userIds');

      // Add bucketId to the leads table
      await queryInterface.addColumn('leads', 'bucketId', {
         type: Sequelize.UUID,
         allowNull: true,
         defaultValue: null,
         references: {
            model: 'buckets',
            key: 'id',
         },
         onDelete: 'SET NULL',
      });

      await queryInterface.createTable('bucketUsers', {
         bucketId: {
            type: Sequelize.UUID,
            references: {
               model: 'buckets',
               key: 'id',
            },
            primaryKey: true,
         },
         userId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            primaryKey: true,
         },
      });

      await queryInterface.createTable('bucketStatuses', {
         bucketId: {
            type: Sequelize.UUID,
            references: {
               model: 'buckets',
               key: 'id',
            },
            primaryKey: true,
         },
         statusId: {
            type: Sequelize.UUID,
            references: {
               model: 'statuses',
               key: 'id',
            },
            primaryKey: true,
         },
      });

      await queryInterface.createTable('bucketLeadSources', {
         bucketId: {
            type: Sequelize.UUID,
            references: {
               model: 'buckets',
               key: 'id',
            },
            primaryKey: true,
         },
         leadSourceId: {
            type: Sequelize.UUID,
            references: {
               model: 'leadSources',
               key: 'id',
            },
            primaryKey: true,
         },
      });
   },

   down: async (queryInterface, Sequelize) => {
      // Rollback logic here
      // Drop many-to-many relationship tables
      await queryInterface.dropTable('bucketLeadSources');
      await queryInterface.dropTable('bucketStatuses');
      await queryInterface.dropTable('bucketUsers');
      await queryInterface.removeColumn('leads', 'bucketId');

      // Add back the old columns to the buckets table
      await queryInterface.addColumn('buckets', 'leadSourceIds', {
         type: Sequelize.ARRAY(Sequelize.UUID),
         allowNull: false,
         defaultValue: [],
      });
      await queryInterface.addColumn('buckets', 'statusIds', {
         type: Sequelize.ARRAY(Sequelize.UUID),
         allowNull: false,
         defaultValue: [],
      });
      await queryInterface.addColumn('buckets', 'userIds', {
         type: Sequelize.ARRAY(Sequelize.UUID),
         allowNull: false,
         defaultValue: [],
      });
   },
};
