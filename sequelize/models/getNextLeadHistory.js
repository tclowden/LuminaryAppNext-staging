'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class getNextLeadHistory extends Model {
      static associate(models) {
         // define association here
         this.belongsTo(models.buckets, { foreignKey: 'bucketId' });
         this.belongsTo(models.leads, { foreignKey: 'leadId' });
         this.belongsTo(models.users, { foreignKey: 'userId' });
      }
   }
   getNextLeadHistory.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         leadJson: DataTypes.JSONB,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         timestamps: true,
         freezeTableName: true,
         modelName: 'getNextLeadHistory',
         paranoid: true,
      }
   );
   return getNextLeadHistory;
};
