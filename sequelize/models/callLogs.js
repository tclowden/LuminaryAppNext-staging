'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class callLogs extends Model {
      static associate(models) {
         this.belongsTo(models.leads, { foreignKey: 'leadId', as: 'lead' });
         this.belongsTo(models.users, { foreignKey: 'userId', as: 'consultant' });
      }
   }
   callLogs.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal('uuid_generate_v4()'),
         },
         sid: DataTypes.STRING,
         from: DataTypes.STRING,
         to: DataTypes.STRING,
         callStatus: DataTypes.STRING,
         direction: DataTypes.STRING,
         duration: DataTypes.STRING,
         recordingUrl: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
         callCompleted: DataTypes.DATE,
      },
      {
         sequelize,
         timestamps: true,
         modelName: 'callLogs',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return callLogs;
};
