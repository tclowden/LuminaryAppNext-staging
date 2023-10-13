'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class attachments extends Model {
      static associate(models) {
         this.belongsTo(models.attachmentTypesLookup, { as: 'attachmentType', foreignKey: 'attachmentTypeId' });
         this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         this.belongsTo(models.orders, { as: 'order', foreignKey: 'orderId' });
         // this.belongsTo(models.users, { as: 'user', foreignKey: 'createdById' });
         this.belongsTo(models.users, { as: 'createdBy', foreignKey: 'createdById' });
         this.belongsTo(models.users, { as: 'updatedBy', foreignKey: 'updatedById' });
      }
   }
   attachments.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         filePath: DataTypes.STRING,
         fileName: DataTypes.STRING,
         fileNickName: DataTypes.STRING,
         publicUrl: DataTypes.TEXT,
         oldId: DataTypes?.INTEGER,
      },
      {
         sequelize,
         modelName: 'attachments',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return attachments;
};
