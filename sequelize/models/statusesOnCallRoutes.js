'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class statusesOnCallRoutes extends Model {
      static associate(models) {
         this.belongsTo(models.statuses, { foreignKey: 'statusId' });
         this.belongsTo(models.callRoutes, { foreignKey: 'callRouteId' });
      }
   }
   statusesOnCallRoutes.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
      },
      {
         sequelize,
         modelName: 'statusesOnCallRoutes',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return statusesOnCallRoutes;
};
