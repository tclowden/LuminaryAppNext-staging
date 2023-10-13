'use strict';

module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('installAppointments', {
         id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         startTime: {
            type: Sequelize.DATE,
            allowNull: false,
         },
         endTime: {
            type: Sequelize.DATE,
            allowNull: false,
         },
         additionalUserIds: {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: true,
            defaultValue: null,
         },
         oldId: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         leadId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'leads', // Assuming the table name is 'leads'
               key: 'id',
            },
         },
         orderId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'orders', // Assuming the table name is 'orders'
               key: 'id',
            },
         },
         productId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'productsLookup', // Assuming the table name is 'products'
               key: 'id',
            },
         },
         teamId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
               model: 'teams', // Assuming the table name is 'teams'
               key: 'id',
            },
         },
         createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
         },
         deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
         },
         oldId: {
            allowNull: true,
            type: Sequelize.INTEGER,
         },
      });
   },

   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('installAppointments');
   },
};
