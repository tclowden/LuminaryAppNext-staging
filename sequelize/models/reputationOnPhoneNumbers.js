'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class reputationOnPhoneNumbers extends Model {
      static associate(models) {
         this.belongsTo(models.phoneNumbers, { as: 'reputation', foreignKey: 'phoneNumberId' });
      }
   }
   reputationOnPhoneNumbers.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         score: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
      },
      {
         sequelize,
         modelName: 'reputationOnPhoneNumbers',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return reputationOnPhoneNumbers;
};
