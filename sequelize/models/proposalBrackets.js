'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class proposalBrackets extends Model {
      static associate(models) {
         this.belongsTo(models.statesLookup, { foreignKey: 'stateId', as: 'state' });
         this.belongsTo(models.proposalProductsConfig, {
            foreignKey: 'proposalProductConfigId',
            as: 'proposalProductConfig',
         });
         this.belongsTo(models.proposalSystemTypesLookup, { foreignKey: 'systemTypeId', as: 'systemType' });
      }
   }

   proposalBrackets.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         travelFee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         kw: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         ppw: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         timestamps: true,
         sequelize,
         modelName: 'proposalBrackets',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return proposalBrackets;
};
