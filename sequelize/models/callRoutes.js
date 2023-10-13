'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class callRoutes extends Model {
      static associate(models) {
         this.belongsToMany(models.phoneNumbers, {
            through: models.phoneNumbersOnCallRoutes,
            foreignKey: 'callRouteId',
            as: 'phoneNumbers',
         });
         this.belongsTo(models.callRouteTypesLookup, { foreignKey: 'typeId', as: 'type' });

         this.hasMany(models.phoneNumbersOnCallRoutes, { as: 'phoneNumbersOnCallRoute', foreignKey: 'callRouteId' });
         this.hasMany(models.statusesOnCallRoutes, { as: 'statusesOnCallRoute', foreignKey: 'callRouteId' });
         this.hasMany(models.actionsOnCallRoutes, { as: 'actionsOnCallRoute', foreignKey: 'callRouteId' });
      }
   }
   callRoutes.init(
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
         description: {
            type: DataTypes.TEXT,
         },
         active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
         },
      },
      {
         sequelize,
         modelName: 'callRoutes',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   callRoutes.beforeDestroy(async (callRoute) => {
      await sequelize.models.actionsOnCallRoutes.destroy({
         where: { callRouteId: callRoute.id },
         individualHooks: true,
      });
      await sequelize.models.phoneNumbersOnCallRoutes.destroy({
         where: { callRouteId: callRoute.id },
         individualHooks: true,
      });
      await sequelize.models.statusesOnCallRoutes.destroy({
         where: { callRouteId: callRoute.id },
         individualHooks: true,
      });
   });

   return callRoutes;
};
