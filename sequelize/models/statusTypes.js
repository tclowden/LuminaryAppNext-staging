'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class statusTypes extends Model {
      static associate(models) {
         this.hasMany(models.statuses, { as: 'statuses', foreignKey: 'typeId' });
      }
   }
   statusTypes.init(
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
         modelName: 'statusTypes',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return statusTypes;
};
