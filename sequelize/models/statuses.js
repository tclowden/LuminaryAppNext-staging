'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class statuses extends Model {
      static associate(models) {
         this.hasMany(models.leads, { foreignKey: 'statusId' });
         this.belongsTo(models.statusTypes, { foreignKey: 'typeId' });
         this.hasMany(models.rulesOnStatuses, { foreignKey: 'statusId' });
         this.hasOne(models.statusMetaData, { foreignKey: 'statusId' });
         this.belongsToMany(models.callRoutes, {
            through: models.statusesOnCallRoutes,
            foreignKey: 'statusId',
            as: 'callRoutes',
         });
         this.hasMany(models.statusesOnCallRoutes, {
            as: 'callRoutesOnStatus',
            foreignKey: 'statusId',
         });
      }
   }
   statuses.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'statuses',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return statuses;
};
