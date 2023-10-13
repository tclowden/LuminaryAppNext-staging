'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class notifications extends Model {
      static associate(models) {
         this.belongsTo(models.notificationTypesLookup, { foreignKey: 'notificationTypeId', as: 'notificationType' });
         this.belongsTo(models.users, { foreignKey: 'taggedUserId', as: 'taggedUser' });
         this.belongsTo(models.teams, { foreignKey: 'taggedTeamId', as: 'taggedTeam' });
         this.belongsTo(models.users, { foreignKey: 'taggedByUserId', as: 'taggedByUser' });
         this.belongsTo(models.notes, { foreignKey: 'noteId', as: 'note' });
      }
   }
   notifications.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         complete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'notifications',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
         oldId: DataTypes.INTEGER,
      }
   );

   return notifications;
};
