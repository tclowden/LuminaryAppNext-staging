'use strict';
const { Model, Sequelize } = require('sequelize');
const { formatPostgresTimestamp } = require('../../utilities/helpers');
// const LumError = require('../../models/Error');

module.exports = (sequelize, DataTypes) => {
   class users extends Model {
      static associate(models) {
         this.hasOne(models.usersKeys, { foreignKey: 'keyTypeId', as: 'keyType' });
         this.belongsTo(models.offices, { foreignKey: 'officeId', as: 'office' });

         this.belongsToMany(models.roles, { foreignKey: 'userId', through: models.rolesOnUsers });
         this.hasMany(models.rolesOnUsers, { foreignKey: 'userId', as: 'rolesOnUser' });

         this.belongsToMany(models.teams, { through: models.teamsUsers, foreignKey: 'userId', as: 'team' });
         this.hasMany(models.teamsUsers, { foreignKey: 'userId', as: 'teamUsers' });

         this.hasMany(models.orders, { foreignKey: 'ownerId' });
         this.hasMany(models.orders, { foreignKey: 'createdById', as: 'userCreatedOrders' });
         this.hasMany(models.notes, { foreignKey: 'createdById' });
         this.hasMany(models.proposalOptions, { foreignKey: 'proposalTechId' });
         this.hasMany(models.leads, { foreignKey: 'ownerId' });
         this.hasMany(models.leads, { foreignKey: 'createdById' });
         this.hasMany(models.leads, { foreignKey: 'setterAgentId' });
         // this.hasMany(models.attachments, { foreignKey: 'userId' });
         this.hasMany(models.attachments, { foreignKey: 'createdById' });
         this.hasMany(models.appointments, { foreignKey: 'createdById' });
         this.hasMany(models.appointments, { foreignKey: 'assignedRepId' });
         this.hasMany(models.proposalOptions, { foreignKey: 'proposalTechId' });
         this.hasMany(models.getNextLeadHistory, { foreignKey: 'userId' });
         this.hasMany(models.callLogs, { foreignKey: 'userId' });
         this.hasMany(models.smsLogs, { foreignKey: 'sentToUserId' });
         this.hasMany(models.smsLogs, { foreignKey: 'sentFromUserId' });

         this.belongsToMany(models.phoneNumbers, {
            through: models.phoneNumbersOnUsers,
            foreignKey: 'userId',
            as: 'phoneNumbers',
         });
         this.hasMany(models.phoneNumbersOnUsers, { as: 'phoneNumbersOnUser', foreignKey: 'userId' });
      }
   }
   users.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         firstName: DataTypes.STRING,
         lastName: DataTypes.STRING,
         preferredFirstName: DataTypes.STRING,
         emailAddress: DataTypes.STRING,
         passwordHash: DataTypes.STRING,
         prefersDarkMode: DataTypes.BOOLEAN,
         profileUrl: DataTypes.STRING,
         oldId: DataTypes.INTEGER,

         // Virtual Fields
         fullName: {
            type: DataTypes.VIRTUAL,
            get() {
               return `${this.firstName || ''} ${this.lastName || ''}`.trim();
            },
            set() {
               // throw new LumError(400, 'Do not try to set the `fullName` value!');
            },
         },
         createdAtPretty: {
            type: DataTypes.VIRTUAL,
            get() {
               return `${formatPostgresTimestamp(this.createdAt)}`;
            },
            set() {
               // throw new LumError(400, 'Do not try to set the `createdAtPretty` value!');
            },
         },
         updatedAtPretty: {
            type: DataTypes.VIRTUAL,
            get() {
               return `${formatPostgresTimestamp(this.updatedAt)}`;
            },
            set() {
               // throw new LumError(400, 'Do not try to set the `updatedAtPretty` value!');
            },
         },
      },
      {
         timestamps: true,
         sequelize,
         modelName: 'users',
         paranoid: true,
         freezeTableName: true,
      }
   );

   // users.beforeUpdate(async (user, options) => {
   //    if (user.archived) {
   //       // archive the associated rolesOnUsers using the role id
   //       await sequelize.models.rolesOnUsers
   //          .unscoped()
   //          .update({ archived: true }, { where: { userId: user.id }, individualHooks: true })
   //          .catch((err) => {
   //             // throw new LumError(400, err);
   //          });
   //    }
   // });

   users.beforeDestroy(async (user, options) => {
      await sequelize.models.rolesOnUsers.destroy({ where: { userId: user.id }, individualHooks: true });
   });

   return users;
};
