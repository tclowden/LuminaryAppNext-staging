'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class keyTypesLookup extends Model {
      static associate(models) {
         // define association here
         this.hasOne(models.usersKeys, { foreignKey: 'keyTypeId' });
      }
   }
   keyTypesLookup.init(
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
         modelName: 'keyTypesLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );
   return keyTypesLookup;
};
