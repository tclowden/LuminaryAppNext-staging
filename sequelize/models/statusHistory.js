'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class statusHistory extends Model {
      static associate(models) {
         this.belongsTo(models.statuses, { as: 'history', foreignKey: 'statusId' });
         this.belongsTo(models.leads, { foreignKey: 'leadId' });
         this.belongsTo(models.users, { foreignKey: 'userId' });
      }
   }
   statusHistory.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'statusHistory',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return statusHistory;
};
