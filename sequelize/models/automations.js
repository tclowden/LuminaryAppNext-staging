'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class automations extends Model {
      static associate(models) {
         this.hasMany(models.automationRuns, { foreignKey: 'automationId', as: 'automationRuns' });
         this.belongsTo(models.segments, {foreignKey: 'segmentId', as: 'segment'})
      }
   }
   automations.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         type: {
            type: DataTypes.STRING,
            allowNull: true,
         },
         triggers: {
            type: DataTypes.JSONB,
            allowNull: true,
         },
         actions: {
            type: DataTypes.JSONB,
            allowNull: true,
         },
         isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         oldId: DataTypes?.INTEGER,
      },
      {
         sequelize,
         modelName: 'automations',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return automations;
};
