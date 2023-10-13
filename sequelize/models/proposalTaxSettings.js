'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class proposalTaxSettings extends Model {
      static associate(models) {
         this.belongsTo(models.proposalSettings, { foreignKey: 'proposalSettingId', as: 'proposalSetting' });
         this.belongsTo(models.statesLookup, { foreignKey: 'stateId', as: 'state' });
      }
   }

   proposalTaxSettings.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         zipCode: DataTypes.STRING,
         taxRegionName: DataTypes.STRING,
         combinedRate: DataTypes.FLOAT,
         stateTaxRate: DataTypes.STRING,
         county: DataTypes.FLOAT,
         city: DataTypes.FLOAT,
         special: DataTypes.FLOAT,
         riskLevel: DataTypes.INTEGER,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'proposalTaxSettings',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return proposalTaxSettings;
};
