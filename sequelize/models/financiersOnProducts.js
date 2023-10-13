'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class financiersOnProducts extends Model {
      static associate(models) {
         this.belongsTo(models.financiersLookup, { foreignKey: 'financierId', as: 'financier' });
         this.belongsTo(models.productsLookup, { foreignKey: 'productId', as: 'product' });
      }
   }
   financiersOnProducts.init(
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
         modelName: 'financiersOnProducts',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return financiersOnProducts;
};
