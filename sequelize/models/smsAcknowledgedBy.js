'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class smsAcknowledgedBy extends Model {
      static associate(models) {
         this.belongsTo(models.leads, { foreignKey: 'leadId' });
      }
   }
   smsAcknowledgedBy.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal('uuid_generate_v4()'),
         },
         acknowledgedByUserIds: {
            type: DataTypes.ARRAY(DataTypes.UUID),
            allowNull: false,
         },
      },
      {
         sequelize,
         timestamps: true,
         modelName: 'smsAcknowledgedBy',
         freezeTableName: true,
         name: {
            singular: 'smsAcknowledgedBy',
            plural: 'smsAcknowledgedBy',
         },
         paranoid: true,
      }
   );
   return smsAcknowledgedBy;
};
