'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class permissionsOnRoles extends Model {
      static associate(models) {
         this.belongsTo(models.permissions, { foreignKey: 'permissionId', as: 'permission' });
         this.belongsTo(models.roles, { foreignKey: 'roleId', as: 'role' });
      }
   }
   permissionsOnRoles.init(
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
         modelName: 'permissionsOnRoles',
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   // permissionsOnRoles.beforeUpdate(async (app, options) => {
   //    // if (app.archived) {
   //    //    // archive everything associated to the app
   //    //    await sequelize.models.pagesLookup
   //    //       .unscoped()
   //    //       .update({ archived: true }, { where: { fieldTypeId: fieldType.id }, individualHooks: true })
   //    //       .catch((err) => {
   //    //          throw new LumError(400, err);
   //    //       });
   //    // }
   // });

   return permissionsOnRoles;
};
