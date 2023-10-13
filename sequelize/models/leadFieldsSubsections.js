'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class leadFieldsSubsections extends Model {
      static associate(models) {
         this.belongsTo(models.leadFieldsSections, { as: 'section', foreignKey: 'sectionId' });
         this.hasMany(models.leadFields, { foreignKey: 'subsectionId' });
      }
   }
   leadFieldsSubsections.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         displayOrder: DataTypes.INTEGER,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'leadFieldsSubsections',
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   // leadFieldsSubsections.beforeUpdate(async (leadFieldsSubsection, options) => {
   //    if (leadFieldsSubsection.deletedAt) {
   //       await sequelize.models.leadFields
   //          .unscoped()
   //          .update({ deletedAt: new Date() }, { where: { subsectionId: leadFieldsSubsection.id }, paranoid: false });
   //    }
   // });

   leadFieldsSubsections.beforeDestroy(async (leadFieldsSubsection, options) => {
      await sequelize.models.leadFields.destroy({
         where: { subsectionId: leadFieldsSubsection.id },
         individualHooks: true,
      });
   });

   return leadFieldsSubsections;
};
