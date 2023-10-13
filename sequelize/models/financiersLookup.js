'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class financiersLookup extends Model {
      static associate(models) {}
   }

   financiersLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         specialNotes: DataTypes.TEXT,
         hidden: DataTypes.BOOLEAN,
         pinned: DataTypes.BOOLEAN,
         loanTermInYears: DataTypes.INTEGER,
         interestRate: DataTypes.FLOAT,
         dealerFee: DataTypes.FLOAT,
         paymentFactorOne: DataTypes.FLOAT,
         paymentFactorTwo: DataTypes.FLOAT,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'financiersLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );
   return financiersLookup;
};
