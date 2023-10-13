'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class proposalProductsConfig extends Model {
      static associate(models) {
         this.belongsTo(models.productsLookup, { foreignKey: 'productId', as: 'product' });
      }
   }
   proposalProductsConfig.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         offsetPercentage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         price: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         pricePerSquareFt: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'proposalProductsConfig',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return proposalProductsConfig;
};
