'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class phoneNumbersOnLeadSources extends Model {
      static associate(models) {
         this.belongsTo(models.phoneNumbers, { foreignKey: 'phoneNumberId' });
         this.belongsTo(models.leadSources, { foreignKey: 'leadSourceId' });
      }
   }
   phoneNumbersOnLeadSources.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'phoneNumbersOnLeadSources',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return phoneNumbersOnLeadSources;
};
