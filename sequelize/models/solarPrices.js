'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class solarPrices extends Model {
      static associate(models) {
         // solarPrices.hasMany(models.solarBrackets, { foreignKey: 'solarPricesId' });
         // solarPrices.hasOne(models.state, { foreignKey: 'id' })
      }
   }

   solarPrices.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         state: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         travelFee: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
         },
         systemType: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         brackets: DataTypes.STRING,
         batch: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'solarPrices',
         paranoid: true,
         timestamps: true,
         freezeTableName: true,
      }
   );

   return solarPrices;
};
