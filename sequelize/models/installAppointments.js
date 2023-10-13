'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class installAppointments extends Model {
      static associate(models) {
         this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         this.belongsTo(models.orders, { foreignKey: 'orderId' });
         this.belongsTo(models.productsLookup, { foreignKey: 'productId' });
         this.belongsTo(models.teams, { foreignKey: 'teamId' });
         this.belongsTo(models.users, { as: 'scheduledBy', foreignKey: 'createdById' });
      }
   }
   installAppointments.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },

         startTime: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         endTime: {
            type: DataTypes.DATE,
            allowNull: false,
         },
         additionalUserIds: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: true,
            defaultValue: null,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'installAppointments',
         paranoid: true,
         timestamps: true,
         freezeTableName: true,
      }
   );
   return installAppointments;
};
