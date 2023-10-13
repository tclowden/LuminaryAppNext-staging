'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.createTable('notificationTypesLookup', {
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

      const notificationTypesAlreadyExists = await queryInterface.sequelize
         .query('SELECT COUNT(*) FROM "notificationTypesLookup";', {
            type: Sequelize.QueryTypes.SELECT,
         })
         .then((res) => JSON.parse(JSON.stringify(res)))
         .then((res) => res[0]?.count);

      if (!notificationTypesAlreadyExists || notificationTypesAlreadyExists == 0) {
         // team type if the notification is for a whole team
         // individual type if the notification is for one person
         await queryInterface.bulkInsert('notificationTypesLookup', [{ name: 'Individual' }, { name: 'Team' }]);
      }

      await queryInterface.createTable('notifications', {
         id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         // content: {
         //    type: Sequelize.TEXT,
         //    allowNull: true,
         // },
         notificationTypeId: {
            type: Sequelize.UUID,
            references: {
               model: 'notificationTypesLookup',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         taggedUserId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         taggedTeamId: {
            type: Sequelize.UUID,
            references: {
               model: 'teams',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         taggedByUserId: {
            type: Sequelize.UUID,
            references: {
               model: 'users',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         noteId: {
            type: Sequelize.UUID,
            references: {
               model: 'notes',
               key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
         },
         complete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('notifications', { force: true });
      await queryInterface.dropTable('notificationTypesLookup', { force: true });
   },
};
