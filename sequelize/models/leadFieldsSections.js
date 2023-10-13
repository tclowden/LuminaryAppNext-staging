'use strict';
const { Model, Sequelize } = require('sequelize');
// const { createLeadFieldsSection } = require('../../lib/LeadFieldSectionDummy');

module.exports = (sequelize, DataTypes) => {
   class leadFieldsSections extends Model {
      static associate(models) {
         this.hasMany(models.leadFieldsSubsections, { foreignKey: 'sectionId' });
      }
   }
   leadFieldsSections.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         displayOrder: DataTypes.INTEGER,
         editable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'leadFieldsSections',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return leadFieldsSections;
};
