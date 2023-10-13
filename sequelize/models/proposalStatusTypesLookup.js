'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class proposalStatusTypesLookup extends Model {
      static associate(models) {}
   }

   proposalStatusTypesLookup.init(
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
         timestamps: true,
         sequelize,
         modelName: 'proposalStatusTypesLookup',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return proposalStatusTypesLookup;
};
