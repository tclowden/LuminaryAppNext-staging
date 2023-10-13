'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class roles extends Model {
      static associate(models) {
         this.belongsToMany(models.users, { through: models.rolesOnUsers, foreignKey: 'roleId' });
         // you can define two different association names...
         this.hasMany(models.rolesOnUsers, { foreignKey: 'roleId', as: 'rolesOnUser' });
         this.hasMany(models.rolesOnUsers, { foreignKey: 'roleId', as: 'usersOnRole' });

         this.belongsToMany(models.permissions, { through: models.permissionsOnRoles, foreignKey: 'roleId' });
         this.hasMany(models.permissionsOnRoles, { foreignKey: 'roleId', as: 'permissionsOnRole' });

         this.belongsToMany(models.productCoordinators, { through: models.rolesOnProductCoordinators, as: 'role' });
         this.belongsToMany(models.stagesOnProducts, {
            through: models.stageOnProductRoleConstraints,
            foreignKey: 'roleId',
         });
      }
   }
   roles.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         description: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
         otherOldIds: DataTypes.ARRAY(DataTypes.INTEGER),
      },
      {
         sequelize,
         modelName: 'roles',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );

   // roles.beforeUpdate(async (role, options) => {
   //    if (role.deletedAt) {
   //       const deletedAt = new Date();
   //       // soft delete everything associated to the role id
   //       // soft delete the associated permissionsOnRoles using the role id
   //       await sequelize.models.permissionsOnRoles
   //          .unscoped()
   //          .update({ deletedAt: deletedAt }, { where: { roleId: role.id }, individualHooks: true })
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //       // soft delete the associated rolesOnUsers using the role id
   //       await sequelize.models.rolesOnUsers
   //          .unscoped()
   //          .update({ deletedAt: deletedAt }, { where: { roleId: role.id }, individualHooks: true })
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //       // soft delete the associated rolesOnProductCoordinators using the role id
   //       await sequelize.models.rolesOnProductCoordinators
   //          .unscoped()
   //          .update({ deletedAt: deletedAt }, { where: { roleId: role.id }, individualHooks: true })
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //    }
   // });

   roles.beforeDestroy(async (role, options) => {
      await sequelize.models.permissionsOnRoles.destroy({ where: { roleId: role.id }, individualHooks: true });
      await sequelize.models.rolesOnUsers.destroy({ where: { roleId: role.id }, individualHooks: true });
      await sequelize.models.rolesOnProductCoordinators.destroy({ where: { roleId: role.id }, individualHooks: true });
   });

   return roles;
};
