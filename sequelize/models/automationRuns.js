'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class automationRuns extends Model {
      static associate(models) {
         this.belongsTo(models.automations, { foreignKey: 'automationId', as: 'automation' });
         this.belongsTo(models.leads, { foreignKey: 'leadId', as: 'lead' });
         this.belongsTo(models.orders, { foreignKey: 'orderId', as: 'order' });
         this.belongsTo(models.users, { foreignKey: 'executorId', as: 'executor' });
      }
   }
   automationRuns.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         trigger: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         previousVal: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         newVal: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         statusType: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         actionData: {
            type: DataTypes.JSONB,
            allowNull: true,
         },
         waitUntil: {
            type: DataTypes.DATE,
            allowNull: true,
         },
         oldId: DataTypes?.INTEGER,
      },
      {
         sequelize,
         modelName: 'automationRuns',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return automationRuns;
};
