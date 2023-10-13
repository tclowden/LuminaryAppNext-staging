'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class auditLogs extends Model {
      static associate(models) {
         this.belongsTo(models.users, {
            as: 'modifiedBy',
            foreignKey: 'modifiedById',
         });
      }
   }
   auditLogs.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         table: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         rowId: {
            type: DataTypes.UUID,
            allowNull: false,
         },
         originalValue: {
            type: DataTypes.JSONB,
            allowNull: false,
         },
         newValue: {
            type: DataTypes.JSONB,
            allowNull: false,
         },
         modifiedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
         },
         // oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'auditLogs',
         timestamps: false,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return auditLogs;
};
