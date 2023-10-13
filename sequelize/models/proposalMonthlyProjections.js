'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class proposalMonthlyProjections extends Model {
      static associate(models) {
         this.belongsTo(models.proposalOptionsExtended, { foreignKey: 'proposalOptionId', as: 'proposalOption' });
      }
   }

   proposalMonthlyProjections.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         janProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         janUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         janBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         febProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         febUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         febBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         marProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         marUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         marBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         aprProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         aprUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         aprBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         mayProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         mayUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         mayBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         junProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         junUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         junBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         julProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         julUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         julBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         augProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         augUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         augBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         sepProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         sepUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         sepBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         octProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         octUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         octBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         novProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         novUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         novBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         decProduction: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         decUsage: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         decBill: {
            type: DataTypes.FLOAT,
            allowNull: true,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         timestamps: true,
         sequelize,
         modelName: 'proposalMonthlyProjections',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return proposalMonthlyProjections;
};
