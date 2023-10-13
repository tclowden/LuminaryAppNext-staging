'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class taskDueDateTypesLookup extends Model {
      static associate(models) {}
   }
   taskDueDateTypesLookup.init(
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
         modelName: 'taskDueDateTypesLookup',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return taskDueDateTypesLookup;
};
