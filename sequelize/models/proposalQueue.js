'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class proposalQueue extends Model {
      static associate(models) {
         this.belongsTo(models.users, { foreignKey: 'ownerId', as: 'owner' });
         this.belongsTo(models.users, { foreignKey: 'completedById', as: 'completedBy' });
         this.belongsTo(models.proposalStatusTypesLookup, { foreignKey: 'proposalStatusId', as: 'proposalStatus' });
         this.belongsTo(models.users, { foreignKey: 'assignedToId', as: 'assignedTo' });
         this.belongsTo(models.users, { foreignKey: 'assignedById', as: 'assignedBy' });
         this.belongsTo(models.users, { foreignKey: 'revisionRequestedById', as: 'revisionRequestedBy' });
         this.belongsTo(models.leads, { foreignKey: 'leadId', as: 'lead' });
      }
   }

   proposalQueue.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         dueAt: {
            type: DataTypes.DATE,
            allowNull: true,
         },
         submittedToSolo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         assignedAt: {
            type: DataTypes.DATE,
            allowNull: true,
         },
         revisionRequestedAt: {
            type: DataTypes.DATE,
            allowNull: true,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         timestamps: true,
         sequelize,
         modelName: 'proposalQueue',
         freezeTableName: true,
         paranoid: true,
      }
   );
   return proposalQueue;
};
