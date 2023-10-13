'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class productStages extends Model {
      static associate(models) {
         this.belongsToMany(models.productsLookup, {
            through: models.stagesOnProducts,
            foreignKey: 'productStageId',
            as: 'productsLookup',
         });
         this.belongsTo(models.stageTypesLookup, { as: 'stageType', foreignKey: 'stageTypeId' });
         this.hasMany(models.stagesOnProducts, { foreignKey: 'productStageId', as: 'stagesOnProduct' });
      }
   }
   productStages.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         webhookUrl: DataTypes.STRING,
         otherOldIds: DataTypes.ARRAY(DataTypes.INTEGER),
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'productStages',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );

   // productStages.beforeUpdate(async (productStage, options) => {
   //    if (productStage.deletedAt) {
   //       // archive everything associated to the productStageId
   //       // archive the fieldsOnProducts using the productStageId
   //       await sequelize.models.stagesOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productStageId: productStage.id }, individualHooks: true, paranoid: false }
   //          )
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //    }
   // });

   productStages.beforeDestroy(async (productStage, options) => {
      await sequelize.models.stagesOnProducts.destroy({
         where: { productStageId: productStage.id },
         individualHooks: true,
      });
   });

   return productStages;
};
