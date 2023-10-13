'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class leadSourceTypes extends Model {
      static associate(models) {
         this.hasMany(models.leadSources, { foreignKey: 'typeId' });
      }
   }
   leadSourceTypes.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         typeName: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'leadSourceTypes',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return leadSourceTypes;
};
