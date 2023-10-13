'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class notificationTypesLookup extends Model {
      static associate(models) {}
   }
   notificationTypesLookup.init(
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
         modelName: 'notificationTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
         oldId: DataTypes.INTEGER,
      }
   );

   return notificationTypesLookup;
};
