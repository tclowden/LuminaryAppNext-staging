'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class stageTypesLookup extends Model {
      static associate(models) {}
   }
   stageTypesLookup.init(
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
         modelName: 'stageTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   // stageTypesLookup.beforeUpdate(async (stageType, options) => {
   //    if (stageType.deletedAt) {
   //       // archive everything associated to the stageTypeId
   //       // archive the productStages using the stageTypeId
   //       await sequelize.models.productStages
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { stageTypeId: stageType.id }, individualHooks: true, paranoid: false }
   //          )
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //    }
   // });

   stageTypesLookup.beforeDestroy(async (stageType, options) => {
      await sequelize.models.productStages.destroy({ where: { stageTypeId: stageType.id }, individualHooks: true });
   });

   return stageTypesLookup;
};
