'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class rolesOnUsers extends Model {
      static associate(models) {
         this.belongsTo(models.users, { foreignKey: 'userId', as: 'user' });
         this.belongsTo(models.roles, { foreignKey: 'roleId', as: 'role' });
      }
   }
   rolesOnUsers.init(
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
         modelName: 'rolesOnUsers',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   // rolesOnUsers.beforeUpdate(async (roleOnUser, options) => {
   //    // if (roleOnUser.archived) {
   //    //    // archive everything associated to the role id
   //    //    // archive the associated rolesOnProductCoordinators using the role id
   //    //    await sequelize.models.rolesOnProductCoordinators
   //    //       .unscoped()
   //    //       .update({ archived: true }, { where: { roleId: roleOnUser.id }, individualHooks: true })
   //    //       .catch((err) => {
   //    //          throw new LumError(400, err);
   //    //       });
   //    // }
   // });

   return rolesOnUsers;
};
