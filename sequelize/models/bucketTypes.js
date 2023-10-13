'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class bucketTypes extends Model {
      static associate(models) {
         this.hasMany(models.buckets, {
            foreignKey: 'bucketTypeId',
         });
      }
   }
   bucketTypes.init(
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
         modelName: 'bucketTypes',
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );
   return bucketTypes;
};
