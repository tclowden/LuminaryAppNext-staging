'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class smsLogs extends Model {
      static associate(models) {
         this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         this.belongsTo(models.users, { as: 'sentFromUser', foreignKey: 'sentFromUserId' });
         this.belongsTo(models.users, { as: 'sentToUser', foreignKey: 'sentToUserId' });
      }
   }
   smsLogs.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal('uuid_generate_v4()'),
         },
         messageSid: DataTypes.STRING,
         to: DataTypes.STRING,
         from: DataTypes.STRING,
         body: DataTypes.TEXT,
         direction: DataTypes.STRING,
         mmsUrls: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
         },
         deliveryStatus: {
            type: DataTypes.STRING,
            allowNull: true,
         },
      },
      {
         sequelize,
         timestamps: true,
         modelName: 'smsLogs',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return smsLogs;
};
