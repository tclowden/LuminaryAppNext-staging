'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class teamTypesLookup extends Model {
      static associate(models) {}
   }
   teamTypesLookup.init(
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
         modelName: 'teamTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );
   return teamTypesLookup;
};
