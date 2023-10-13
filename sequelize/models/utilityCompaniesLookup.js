'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class utilityCompaniesLookup extends Model {
      static associate(models) {
         this.belongsTo(models.statesLookup, { as: 'state', foreignKey: 'stateId' });
         this.belongsTo(models.netMeteringTypesLookup, {
            as: 'netMeteringType',
            foreignKey: 'netMeteringTypeId',
         });
      }
   }
   utilityCompaniesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         specialNotes: DataTypes.TEXT,
         netMeter: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         connectionFee: {
            type: DataTypes.DECIMAL,
            defaultValue: '0.00',
         },
         additionalCost: {
            type: DataTypes.DECIMAL,
            defaultValue: '0.00',
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'utilityCompaniesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );
   return utilityCompaniesLookup;
};
