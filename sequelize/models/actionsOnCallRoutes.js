'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class actionsOnCallRoutes extends Model {
      static associate(models) {
         this.belongsTo(models.callRoutes, { foreignKey: 'callRouteId' });
         this.belongsTo(models.callRouteActionTypesLookup, { foreignKey: 'actionTypeId', as: 'type' });
      }
   }
   actionsOnCallRoutes.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         userIdsToDial: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
         },
         roleIdsToDial: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
         },
         waitSeconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
         },
         displayOrder: {
            type: DataTypes.INTEGER,
         },
         messageToSay: {
            type: DataTypes.TEXT,
         },
         waitMusicUrl: {
            type: DataTypes.STRING,
         },
      },
      {
         sequelize,
         modelName: 'actionsOnCallRoutes',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return actionsOnCallRoutes;
};
