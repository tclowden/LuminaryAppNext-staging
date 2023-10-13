'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class teamsUsers extends Model {
      static associate(models) {
         this.belongsTo(models.teams, { foreignKey: 'teamId', as: 'team' });
         this.belongsTo(models.users, { foreignKey: 'userId', as: 'user' });
      }
   }
   teamsUsers.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         teamLead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'teamsUsers',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return teamsUsers;
};
