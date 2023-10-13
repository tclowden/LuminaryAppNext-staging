'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class Segments extends Model {
      static associate(models) {
         this.hasMany(models.automations, {foreignKey: 'segmentId'})
      }
   }

   Segments.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         filter: DataTypes.JSONB,
         type: {
            type: DataTypes.ENUM('Static', 'Dynamic'),
            defaultValue: 'Dynamic',
            allowNull: false,
         },
      },
      {
         sequelize,
         modelName: 'segments',
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   return Segments;
};
