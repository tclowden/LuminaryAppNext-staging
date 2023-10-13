'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class proposalSettings extends Model {
      static associate(models) {}
   }

   proposalSettings.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         universalDealerFee: {
            type: DataTypes.FLOAT,
            allowNull: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'proposalSettings',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return proposalSettings;
};
