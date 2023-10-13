'use strict';
const { Model, Sequelize } = require('sequelize');
// const LumError = require('../../models/Error');

module.exports = (sequelize, DataTypes) => {
   class productFields extends Model {
      static associate(models) {
         this.belongsTo(models.fieldTypesLookup, { as: 'fieldType', foreignKey: 'fieldTypeId' });
         this.belongsTo(models.configuredListsLookup, { as: 'configuredList', foreignKey: 'configuredListId' });
         this.belongsToMany(models.productsLookup, {
            through: models.fieldsOnProducts,
            foreignKey: 'productFieldId',
            as: 'productsLookup',
         });
         this.hasMany(models.productFieldOptions);
         this.hasMany(models.fieldsOnProducts, { as: 'fieldsOnProduct', foreignKey: 'productFieldId' });
         this.hasMany(models.fieldsOnOrders, { as: 'fieldsOnOrder', foreignKey: 'productFieldId' });
      }
   }
   productFields.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         label: DataTypes.STRING,
         placeholder: DataTypes.STRING,
         whereCondition: DataTypes.JSONB,
         oldId: DataTypes.INTEGER,
         otherOldIds: DataTypes.ARRAY(DataTypes.INTEGER),
      },
      {
         sequelize,
         modelName: 'productFields',
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   // productFields.beforeUpdate(async (productField, options) => {
   //    if (productField.deletedAt) {
   //       // archive everything associated to the productFieldId
   //       await sequelize.models.productFieldOptions
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productFieldId: productField.id }, individualHooks: true, paranoid: false }
   //          );

   //       // archive the fieldsOnProducts using the productFieldId
   //       await sequelize.models.fieldsOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productFieldId: productField.id }, individualHooks: true, paranoid: false }
   //          );
   //    }
   // });

   productFields.beforeDestroy(async (productField, options) => {
      // archive everything associated to the productFieldId
      await sequelize.models.productFieldOptions.destroy({
         where: { productFieldId: productField.id },
         individualHooks: true,
      });

      // archive the fieldsOnProducts using the productFieldId
      await sequelize.models.fieldsOnProducts.destroy({
         where: { productFieldId: productField.id },
         individualHooks: true,
      });
   });

   return productFields;
};
