'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class leadFields extends Model {
      static associate(models) {
         this.belongsTo(models.leadFieldsSubsections, { as: 'subsection', foreignKey: 'subsectionId' });
         this.belongsTo(models.fieldTypesLookup, { as: 'fieldType', foreignKey: 'fieldTypeId' });
         this.hasMany(models.leadFieldOptions, { foreignKey: 'leadFieldId' });
         this.hasOne(models.fieldsOnLeads, { as: 'fieldOnLead', foreignKey: 'leadFieldId' });
      }
   }
   leadFields.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         label: DataTypes.STRING,
         placeholder: DataTypes.STRING,
         required: DataTypes.BOOLEAN,
         displayOrder: DataTypes.INTEGER,
         whereCondition: DataTypes.JSONB,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'leadFields',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   // leadFields.beforeUpdate(async (leadField, options) => {
   //    if (leadField.deletedAt) {
   //       await sequelize.models.leadFieldOptions
   //          .unscoped()
   //          .update({ deletedAt: new Date() }, { where: { leadFieldId: leadField.id }, paranoid: false });

   //       await sequelize.models.fieldsOnLeads
   //          .unscoped()
   //          .update({ deletedAt: new Date() }, { where: { leadFieldId: leadField.id }, paranoid: false });
   //    }
   // });

   leadFields.beforeDestroy(async (leadField, options) => {
      await sequelize.models.leadFieldOptions.update({ where: { leadFieldId: leadField.id }, individualHooks: true });
      await sequelize.models.fieldsOnLeads.update({ where: { leadFieldId: leadField.id }, individualHooks: true });
   });

   return leadFields;
};
