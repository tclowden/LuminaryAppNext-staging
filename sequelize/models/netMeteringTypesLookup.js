'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class netMeteringTypesLookup extends Model {
      static associate(models) {}
   }
   netMeteringTypesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
      },
      {
         sequelize,
         modelName: 'netMeteringTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
         oldId: DataTypes.INTEGER,
      }
   );

   // netMeteringTypesLookup.beforeUpdate(async (stageType, options) => {
   //    if (stageType.archived) {
   //       // archive everything associated to the stageTypeId
   //       // archive the productStages using the stageTypeId
   //       await sequelize.models.productStages
   //          .unscoped()
   //          .update({ archived: true }, { where: { stageTypeId: stageType.id }, individualHooks: true })
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //    }
   // });

   return netMeteringTypesLookup;
};
