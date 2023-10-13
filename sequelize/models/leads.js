'use strict';
const { Model, Sequelize } = require('sequelize');
const { LumError } = require('../../utilities/models/LumError');
const { getFormattedPhoneNumber } = require('../../utilities/helpers');

const { formatPostgresTimestamp } = require('../../utilities/helpers');

module.exports = (sequelize, DataTypes) => {
   class leads extends Model {
      static associate(models) {
         // on the leads model
         this.belongsTo(models.users, { as: 'owner', foreignKey: 'ownerId' });
         this.belongsTo(models.users, { as: 'createdBy', foreignKey: 'createdById' });
         this.belongsTo(models.users, { as: 'setterAgent', foreignKey: 'setterAgentId', allowNull: true });
         this.belongsTo(models.statuses, { as: 'status', foreignKey: 'statusId' });
         this.belongsTo(models.leadSources, { foreignKey: 'leadSourceId' });
         this.belongsTo(models.buckets, { as: 'bucket', foreignKey: 'bucketId' });

         // On other models
         this.hasMany(models.orders, { foreignKey: 'leadId' });
         this.hasMany(models.appointments);
         this.hasMany(models.notes, { foreignKey: 'leadId' });
         this.hasMany(models.attachments, { foreignKey: 'leadId' });
         this.hasMany(models.fieldsOnLeads, { foreignKey: 'leadId' });
         this.hasMany(models.getNextLeadHistory, { foreignKey: 'leadId' });
         this.hasMany(models.callLogs, { foreignKey: 'leadId' });
         this.hasMany(models.smsLogs, { foreignKey: 'leadId' });
         this.hasOne(models.smsAcknowledgedBy, { foreignKey: 'leadId' });
      }
   }
   leads.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         isAvailableInQueue: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
         },
         firstName: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         lastName: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         phoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
               // have to comment out this for migration purposes...
               // some phonenumbers in curr lum is invalid
               // len: [10, 10],
            },
         },
         phoneVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         callCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
         },
         emailAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
               // have to comment out this for migration purposes...
               // some emails in curr lum is invalid
               // isEmail: true,
            },
         },
         emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         streetAddress: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         city: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         state: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         zipCode: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         latitude: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         longitude: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
         },
         addressVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
         },
         otherOldIds: DataTypes.ARRAY(DataTypes.INTEGER),
         oldId: DataTypes.INTEGER,

         // Virtual Fields
         fullName: {
            type: DataTypes.VIRTUAL,
            get() {
               const firstName = this.firstName || '';
               const lastName = this.lastName || '';
               return `${firstName} ${lastName}`.trim();
            },
            set() {
               throw new LumError(400, 'Do not try to set the `fullName` value!');
            },
         },
         phoneNumberPretty: {
            type: DataTypes.VIRTUAL,
            get() {
               if (!this.phoneNumber) return null;
               return getFormattedPhoneNumber(this.phoneNumber);
            },
            set() {
               throw new LumError(400, 'Do not try to set the `phoneNumber` value!');
            },
         },
         fullAddress: {
            type: DataTypes.VIRTUAL,
            get() {
               const streetAddress = this.streetAddress || '';
               const city = this.city || '';
               const state = this.state || '';
               const zipCode = this.zipCode || '';
               return `${streetAddress}${streetAddress && '\n'}${city} ${state}${
                  (city || state) && zipCode && ', '
               }${zipCode}`.trim();
            },
            set() {
               throw new LumError(400, 'Do not try to set the `address` value!');
            },
         },
         lastAppointment: {
            type: DataTypes.VIRTUAL,
            get() {
               if (this.appointments && this.appointments?.length) {
                  // sort appointments from by appointmentTime DESC...
                  // return the first appointment that is currently in the past
                  let mostCurrentLastAppt = this.appointments
                     .sort((a, b) => b?.appointmentTime - a?.appointmentTime)
                     .find((appt) => {
                        const now = new Date();
                        const apptTime = new Date(appt?.appointmentTime);
                        if (apptTime < now) return appt;
                     });

                  mostCurrentLastAppt = {
                     ...mostCurrentLastAppt,
                     appointmentTime: mostCurrentLastAppt
                        ? formatPostgresTimestamp(mostCurrentLastAppt?.appointmentTime)
                        : null,
                  };

                  return mostCurrentLastAppt;
               }
            },
            set() {
               throw new LumError(400, 'Do not try to set the `lastAppointment` value!');
            },
         },
         createdAtPretty: {
            type: DataTypes.VIRTUAL,
            get() {
               if (!this.createdAt) return null;
               return formatPostgresTimestamp(this.createdAt);
            },
            set() {
               throw new LumError(400, 'Do not try to set the `createdAtPretty` value!');
            },
         },
      },
      {
         sequelize,
         modelName: 'leads',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return leads;
};
