'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class orders extends Model {
      static associate(models) {
         this.belongsTo(models.users, { as: 'owner', foreignKey: 'ownerId' });
         this.belongsTo(models.users, { as: 'createdBy', foreignKey: 'createdById' });
         this.belongsTo(models.productsLookup, { as: 'product', foreignKey: 'productId' });
         this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         // this.belongsToMany(models.fieldsOnProducts, { through: models.fieldsOnOrders, foreignKey: 'orderId' });
         this.hasMany(models.fieldsOnOrders, { as: 'fieldsOnOrder', foreignKey: 'orderId' });
         this.hasMany(models.notes, { foreignKey: 'orderId' });
         this.hasMany(models.attachments, { foreignKey: 'orderId' });
         this.belongsTo(models.productStages, { foreignKey: 'productStageId', as: 'productStage' });
         this.belongsTo(models.utilityCompaniesLookup, { foreignKey: 'utilityCompanyId', as: 'utilityCompany' });
         this.belongsTo(models.financiersLookup, { foreignKey: 'financierId', as: 'financier' });
      }
   }
   orders.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         total: DataTypes.FLOAT, // just a calculation based on Currency types
         firstFundedAmount: DataTypes.FLOAT,
         secondFundedAmount: DataTypes.FLOAT,
         thirdFundedAmount: DataTypes.FLOAT,
         firstFundedAt: DataTypes.DATE,
         secondFundedAt: DataTypes.DATE,
         thirdFundedAt: DataTypes.DATE,
         cityTax: DataTypes.FLOAT,
         stateTax: DataTypes.FLOAT,
         countyTax: DataTypes.FLOAT,
         dealerFee: DataTypes.FLOAT,
         installAddress: DataTypes.STRING,
         installSignedDate: DataTypes.DATE,
         migratedColsToFields: DataTypes.BOOLEAN,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'orders',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return orders;
};
