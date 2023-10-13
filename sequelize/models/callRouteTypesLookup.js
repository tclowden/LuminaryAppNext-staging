'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class callRouteTypesLookup extends Model {
      static associate(models) {
         this.hasMany(models.callRoutes, { foreignKey: 'typeId' });
      }
   }
   callRouteTypesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
      },
      {
         sequelize,
         modelName: 'callRouteTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return callRouteTypesLookup;
};
