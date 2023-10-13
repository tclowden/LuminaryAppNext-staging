'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class revisionsRequested extends Model {
      static associate(models) {
         // define association here
         this.belongsTo(models.proposalQueue, { foreignKey: 'proposalQueueId', as: 'queueId' });
      }
   }
   revisionsRequested.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         energyUsage: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         sqFtRoof: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         electricCompany: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         other: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         note: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
         },
      },
      {
         sequelize,
         modelName: 'revisionsRequested',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );

   return revisionsRequested;
};
