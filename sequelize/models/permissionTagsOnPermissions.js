'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class permissionTagsOnPermissions extends Model {
      static associate(models) {
         this.belongsTo(models.permissions, { foreignKey: 'permissionId', as: 'permission' });
         this.belongsTo(models.permissionTagsLookup, { foreignKey: 'permissionTagId', as: 'permissionTag' });
      }
   }
   permissionTagsOnPermissions.init(
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
         modelName: 'permissionTagsOnPermissions',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return permissionTagsOnPermissions;
};
