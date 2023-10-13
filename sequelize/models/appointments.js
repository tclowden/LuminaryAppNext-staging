'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class appointments extends Model {
      static associate(models) {
         this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         this.belongsTo(models.appointmentTypesLookup, { as: 'appointmentType', foreignKey: 'appointmentTypeId' });
         this.belongsTo(models.users, { as: 'createdBy', foreignKey: 'createdById' });
         this.belongsTo(models.users, { as: 'assignedRep', foreignKey: 'assignedRepId' });
      }
   }
   appointments.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         appointmentTime: DataTypes.DATE,
         kept: DataTypes.BOOLEAN,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'appointments',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return appointments;
};
