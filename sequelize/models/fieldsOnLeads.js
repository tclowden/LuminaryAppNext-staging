'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class fieldsOnLeads extends Model {
      static associate(models) {
         this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         this.belongsTo(models.leadFields, { as: 'leadField', foreignKey: 'leadFieldId' });
      }
   }
   fieldsOnLeads.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         answer: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'fieldsOnLeads',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );
   return fieldsOnLeads;
};
