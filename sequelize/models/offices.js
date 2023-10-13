'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class offices extends Model {
      static associate(models) {
         this.hasOne(models.users, { foreignKey: 'officeId' });
      }
   }
   offices.init(
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
         modelName: 'offices',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return offices;
};
