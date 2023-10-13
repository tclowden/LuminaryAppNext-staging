'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class fieldTypesLookup extends Model {
      static associate(models) {
         // define association here
         this.hasOne(models.productFields, { foreignKey: 'fieldTypeId' });
         this.hasOne(models.leadFields, { foreignKey: 'fieldTypeId' });
      }
   }
   fieldTypesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         iconName: DataTypes.STRING,
         iconColor: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'fieldTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   // fieldTypesLookup.beforeUpdate(async (fieldType, options) => {
   //    if (fieldType.deletedAt) {
   //       // archive everything associated to the productFieldId
   //       await sequelize.models.productFields
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { fieldTypeId: fieldType.id }, individualHooks: true, paranoid: false }
   //          );
   //    }
   // });

   fieldTypesLookup.beforeDestroy(async (fieldType, options) => {
      // archive everything associated to the productFieldId
      await sequelize.models.productFields.destroy({ where: { fieldTypeId: fieldType.id }, individualHooks: true });
   });

   return fieldTypesLookup;
};
