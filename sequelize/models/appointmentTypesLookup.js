'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class appointmentTypesLookup extends Model {
      static associate(models) {
         this.hasOne(models.appointments, { foreignKey: 'appointmentTypeId', as: 'appointmentType' });
      }
   }
   appointmentTypesLookup.init(
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
         oldId: DataTypes?.INTEGER,
      },
      {
         sequelize,
         modelName: 'appointmentTypesLookup',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return appointmentTypesLookup;
};
