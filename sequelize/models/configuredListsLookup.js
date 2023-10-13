'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class configuredListsLookup extends Model {
      static associate(models) {
         // this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         // this.belongsTo(models.statuses, { as: 'status', foreignKey: 'statusId' });
         // this.belongsTo(models.users, { as: 'user', foreignKey: 'userId' });
      }
   }
   configuredListsLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         tableName: DataTypes.STRING,
         // this is for configuring a dropdown on the client side...
         // add a keyPath here to allow the dropdown to access the spcific column for display purposes
         // for ex) keyPath: 'name'... when pulling from the financiers table, it will look for the values in the 'name' column
         // for ex) keyPath: 'firstName'... when pulling from the users table, it will look for the values in the 'firstName' column
         keyPath: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'configuredListsLookup',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   // configuredListsLookup.beforeUpdate(async (configuredList, options) => {
   //    if (configuredList.deletedAt) {
   //       // set configuredListId to null in the product fields
   //       await sequelize.models.productFields
   //          .unscoped()
   //          .update(
   //             { configuredListId: null },
   //             { where: { configuredListId: configuredList.id }, individualHooks: true, paranoid: false }
   //          );
   //    }
   // });

   // configuredListsLookup.beforeDestroy(async (configuredList, options) => {
   //    // set configuredListId to null in the product fields
   //    await sequelize.models.productFields
   //       .unscoped()
   //       .update(
   //          { configuredListId: null },
   //          { where: { configuredListId: configuredList?.id }, individualHooks: true }
   //       );
   // });

   return configuredListsLookup;
};
