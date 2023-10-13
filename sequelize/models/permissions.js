'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class permissions extends Model {
      static associate(models) {
         // this.belongsTo(models.permissions, { foreignKey: 'parentPermissionId', as: 'parentPermission' }); // a recursive way to add subsections to pages
         this.belongsTo(models.pagesLookup, { foreignKey: 'pageId', as: 'page' });

         this.belongsToMany(models.roles, {
            through: models.permissionsOnRoles,
            foreignKey: 'permissionId',
         });
         this.hasMany(models.permissionsOnRoles, { foreignKey: 'permissionId', as: 'rolesOnPermission' });

         this.belongsToMany(models.permissionTagsLookup, {
            through: models.permissionTagsOnPermissions,
            foreignKey: 'permissionId',
         });

         this.hasMany(models.permissionTagsOnPermissions, {
            foreignKey: 'permissionId',
            as: 'permissionTagsOnPermission',
         });
      }
   }
   permissions.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         description: DataTypes.STRING, // this name is what the client will show when user is toggling permissions to user
         // this boolean should be true if it's the permission to view the page...
         isDefaultPermission: {
            type: DataTypes?.BOOLEAN,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'permissions',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   // permissions.beforeUpdate(async (permission, options) => {
   //    if (permission.deletedAt) {
   //       const deletedAt = new Date();
   //       // soft delete everything associated to the permissionId
   //       // soft delete  the associated permissionsOnRoles using the permission id
   //       await sequelize.models.permissionsOnRoles
   //          .unscoped()
   //          .update(
   //             { deletedAt: deletedAt },
   //             { where: { permissionId: permission.id }, individualHooks: true, paranoid: false }
   //          );
   //       // soft delete  the associated permissionTagsOnPermissions using the permission id
   //       await sequelize.models.permissionTagsOnPermissions
   //          .unscoped()
   //          .update(
   //             { deletedAt: deletedAt },
   //             { where: { permissionId: permission.id }, individualHooks: true, paranoid: false }
   //          );
   //    } else if (!permission.deletedAt) {
   //       // undo soft delete  everything associated to the permissionId
   //       // undo soft delete  the associated permissionsOnRoles using the permission id
   //       await sequelize.models.permissionsOnRoles
   //          .unscoped()
   //          .update(
   //             { deletedAt: null },
   //             { where: { permissionId: permission.id }, individualHooks: true, paranoid: false }
   //          );
   //       // undo soft delete  the associated permissionTagsOnPermissions using the permission id
   //       await sequelize.models.permissionTagsOnPermissions
   //          .unscoped()
   //          .update(
   //             { deletedAt: null },
   //             { where: { permissionId: permission.id }, individualHooks: true, paranoid: false }
   //          );
   //    }
   // });

   permissions.beforeDestroy(async (permission, options) => {
      // soft delete the associated permissionsOnRoles using the permission id
      await sequelize.models.permissionsOnRoles.destroy({
         where: { permissionId: permission.id },
         individualHooks: true,
      });
      // soft delete the associated permissionTagsOnPermissions using the permission id
      await sequelize.models.permissionTagsOnPermissions.destroy({
         where: { permissionId: permission.id },
         individualHooks: true,
      });
   });

   return permissions;
};
