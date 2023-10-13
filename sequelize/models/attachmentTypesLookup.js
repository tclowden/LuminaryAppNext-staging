'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class attachmentTypesLookup extends Model {
      static associate(models) {
         this.hasMany(models.attachments, { foreignKey: 'attachmentTypeId' });
      }
   }
   attachmentTypesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         oldId: DataTypes?.INTEGER,
      },
      {
         sequelize,
         modelName: 'attachmentTypesLookup',
         paranoid: true,
         timestamps: true,
         freezeTableName: true,
      }
   );
   return attachmentTypesLookup;
};
