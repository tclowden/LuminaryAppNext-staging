'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class statusScreenConfigs extends Model {
      static associate(models) {
         // this.belongsTo(models.)
      }
   }
   statusScreenConfigs.init(
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
         modelName: 'statusScreenConfigs',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return statusScreenConfigs;
};
