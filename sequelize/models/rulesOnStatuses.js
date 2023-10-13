'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class rulesOnStatuses extends Model {
      static associate(models) {
         this.belongsTo(models.statuses, { foreignKey: 'statusId' });
         this.belongsTo(models.statusRulesTypes, { foreignKey: 'statusRulesTypesId' });
      }
   }

   rulesOnStatuses.init(
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
         modelName: 'rulesOnStatuses',
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   return rulesOnStatuses;
};
