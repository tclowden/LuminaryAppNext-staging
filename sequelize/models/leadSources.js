'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class leadSources extends Model {
      static associate(models) {
         this.belongsTo(models.leadSourceTypes, { foreignKey: 'typeId' });
         this.hasMany(models.leads, { foreignKey: 'leadSourceId' });

         this.belongsToMany(models.phoneNumbers, {
            through: models.phoneNumbersOnLeadSources,
            foreignKey: 'leadSourceId',
         });
      }
   }
   leadSources.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         endpoint: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'leadSources',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return leadSources;
};
