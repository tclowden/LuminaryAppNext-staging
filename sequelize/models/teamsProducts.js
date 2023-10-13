'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class teamsProducts extends Model {
      static associate(models) {
         this.belongsTo(models.teams, { foreignKey: 'teamId' });
         this.belongsTo(models.productsLookup, { foreignKey: 'productId', as: 'product' });
      }
   }
   teamsProducts.init(
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
         modelName: 'teamsProducts',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return teamsProducts;
};
