'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class permissionTagsLookup extends Model {
      static associate(models) {
         this.belongsToMany(models.permissions, {
            through: models.permissionTagsOnPermissions,
            foreignKey: 'permissionTagId',
         });
         // this.hasMany(models.permissionTagsOnPermissions, { foreignKey: 'permissionTagId', as: 'permissionTag' });
      }
   }
   permissionTagsLookup.init(
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
         modelName: 'permissionTagsLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   // permissionTagsLookup.beforeUpdate(async (permissionTag, options) => {
   //    if (permissionTag.deletedAt) {
   //       // archive permissionTagsOnPermissions associated to the permissionTagId
   //       await sequelize.models.permissionTagsOnPermissions
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { permissionTagId: permissionTag.id }, individualHooks: true, paranoid: false }
   //          )
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //    }
   // });

   permissionTagsLookup.beforeUpdate(async (permissionTag, options) => {
      // archive permissionTagsOnPermissions associated to the permissionTagId
      await sequelize.models.permissionTagsOnPermissions.destroy({
         where: { permissionTagId: permissionTag.id },
         individualHooks: true,
      });
   });

   return permissionTagsLookup;
};
