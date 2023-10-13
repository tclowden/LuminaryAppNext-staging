'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class callRouteActionTypesLookup extends Model {
      static associate(models) {
         this.hasMany(models.actionsOnCallRoutes, { foreignKey: 'actionTypeId' });
      }
   }
   callRouteActionTypesLookup.init(
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
         modelName: 'callRouteActionTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return callRouteActionTypesLookup;
};
