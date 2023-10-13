'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class proposalSavingOptionTypesLookup extends Model {
      static associate(models) {}
   }
   proposalSavingOptionTypesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'proposalSavingOptionTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return proposalSavingOptionTypesLookup;
};
