'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class coordinatorsOnOrders extends Model {
      static associate(models) {
         this.belongsTo(models.coordinatorsOnProducts, {
            foreignKey: 'coordinatorOnProductId',
            as: 'coordinatorOnProduct',
         });
         this.belongsTo(models.productCoordinators, { foreignKey: 'productCoordinatorId', as: 'productCoordinator' });
         this.belongsTo(models.orders, { foreignKey: 'orderId', as: 'order' });
      }
   }
   coordinatorsOnOrders.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'coordinatorsOnOrders',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return coordinatorsOnOrders;
};
