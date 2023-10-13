'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class proposalOptions extends Model {
      static associate(models) {
         this.hasMany(models.proposalOptionsExtended, { foreignKey: 'proposalOptionId', as: 'proposalOption' });
         this.belongsTo(models.leads, { foreignKey: 'leadId', as: 'lead' });
         this.belongsTo(models.proposalTypesLookup, { foreignKey: 'proposalTypeId', as: 'proposalType' });
         this.belongsTo(models.users, { foreignKey: 'proposalTechId', as: 'proposalTech' });
         // this.belongsTo(models.statesLookup, { foreignKey: 'stateId', as: 'state' });
         this.belongsTo(models.financiersLookup, { foreignKey: 'financierId', as: 'financier' });
         this.belongsTo(models.utilityCompaniesLookup, { foreignKey: 'utilityCompanyId', as: 'utility' });
         this.belongsTo(models.proposalSavingOptionTypesLookup, {
            foreignKey: 'savingsOptionDisplayId',
            as: 'savingsOptionDisplay',
         });
      }
   }

   proposalOptions.init(
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
         // connectionFee: {
         //    type: DataTypes.FLOAT,
         //    allowNull: true,
         // },
         downPayment: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         taxCreditAsDownPayment: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         // displayCalculator: {
         //    type: DataTypes.BOOLEAN,
         //    allowNull: false,
         //    defaultValue: false,
         // },
         totalCost: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         overrideDealerFee: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         includeTravelFee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         offsetDisclaimer: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         timestamps: true,
         sequelize,
         modelName: 'proposalOptions',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return proposalOptions;
};
