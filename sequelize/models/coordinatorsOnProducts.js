'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class coordinatorsOnProducts extends Model {
      static associate(models) {
         this.belongsTo(models.productCoordinators, { foreignKey: 'productCoordinatorId', as: 'productCoordinator' });
         this.belongsTo(models.productsLookup, { foreignKey: 'productId', as: 'product' });
      }
   }
   coordinatorsOnProducts.init(
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
         modelName: 'coordinatorsOnProducts',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return coordinatorsOnProducts;
};
