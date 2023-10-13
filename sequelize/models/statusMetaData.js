'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class statusMetaData extends Model {
      static associate(models) {
         this.belongsTo(models.statuses, { foreignKey: 'statusId' });
      }
   }
   statusMetaData.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         requiredNumberOfCalls: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
         },
         webhookUrl: {
            type: Sequelize.STRING,
            defaultValue: null,
            allowNull: true,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'statusMetaData',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
         name: {
            singular: 'statusMetaData',
            plural: 'statusMetaData',
         },
      }
   );

   return statusMetaData;
};
