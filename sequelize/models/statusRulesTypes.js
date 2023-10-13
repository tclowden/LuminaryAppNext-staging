'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class statusRulesTypes extends Model {
      static associate(models) {
         this.hasOne(models.rulesOnStatuses, { as: 'statusRulesTypeId', foreignKey: 'statusRulesTypesId' });
      }
   }
   statusRulesTypes.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         description: DataTypes.TEXT,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'statusRulesTypes',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );

   return statusRulesTypes;
};
