'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class proposalSystemTypesLookup extends Model {
      static associate(models) {}
   }
   proposalSystemTypesLookup.init(
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
         modelName: 'proposalSystemTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return proposalSystemTypesLookup;
};
