'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class stagesOnOrders extends Model {
      static associate(models) {
         this.belongsTo(models.stagesOnProducts, { foreignKey: 'stageOnProductId', as: 'stageOnProduct' });
         this.belongsTo(models.users, { foreignKey: 'assignedToId', as: 'assignedTo' });
         this.belongsTo(models.orders, { foreignKey: 'orderId', as: 'order' });
      }
   }
   stagesOnOrders.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         assignedAt: DataTypes.DATE,
         completedAt: DataTypes.DATE,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'stagesOnOrders',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return stagesOnOrders;
};
