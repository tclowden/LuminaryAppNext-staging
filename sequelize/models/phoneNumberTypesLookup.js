'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class phoneNumberTypesLookup extends Model {
      static associate(models) {
         this.hasOne(models.phoneNumbers, { as: 'type', foreignKey: 'typeId' });
      }
   }
   phoneNumberTypesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'phoneNumberTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   return phoneNumberTypesLookup;
};
