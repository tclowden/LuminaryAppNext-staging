'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class proposalOptionsExtended extends Model {
      static associate(models) {
         // this.belongsTo(models.proposalOptions, { foreignKey: 'id' });
         this.belongsTo(models.proposalOptions, { foreignKey: 'proposalOptionId', as: 'proposal' });
         this.belongsTo(models.productsLookup, { foreignKey: 'productId', as: 'product' });
         this.belongsTo(models.proposalSystemTypesLookup, { foreignKey: 'systemTypeId', as: 'systemType' });
         this.belongsTo(models.proposalProductsConfig, { foreignKey: 'id', as: 'proposalProductsConfigId' });
         // this.belongsTo(models.proposalProductOptions, {
         //    foreignKey: 'proposalProductOptionId',
         //    as: 'proposalProductOption',
         // });
      }
   }

   proposalOptionsExtended.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         // doNetMeter: {
         //    type: DataTypes.BOOLEAN,
         //    allowNull: true,
         // },
         systemSize: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         panelSize: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         numberOfPanels: {
            type: DataTypes.INTEGER,
            allowNull: true,
         },
         homeImageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         priceOverride: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         additionalCost: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         checkCost: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         trenchingCost: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         notes: {
            type: DataTypes.TEXT,
            allowNull: true,
         },
         squareFootage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         overrideOffset: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         dualFuelUpgrade: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
         },
         showDetailsSection: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         quanity: {
            type: DataTypes.INTEGER,
            allowNull: true,
         },
         proposalProductConfigId: {
            type: DataTypes.UUID,
            allowNull: true,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         timestamps: true,
         sequelize,
         modelName: 'proposalOptionsExtended',
         freezeTableName: true,
         paranoid: true,
      }
   );

   return proposalOptionsExtended;
};
