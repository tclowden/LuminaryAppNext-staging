'use strict';
const { Model, Sequelize } = require('sequelize');
const { formatPostgresTimestamp } = require('../../utilities/helpers');
const { LumError } = require('../../utilities/models/LumError');

module.exports = (sequelize, DataTypes) => {
   class notes extends Model {
      static associate(models) {
         this.belongsTo(models.users, { as: 'createdBy', foreignKey: 'createdById' });
         this.belongsTo(models.users, { as: 'updatedBy', foreignKey: 'updatedById' });
         this.belongsTo(models.leads, { as: 'lead', foreignKey: 'leadId' });
         this.belongsTo(models.orders, { as: 'order', foreignKey: 'orderId' });
         this.hasMany(models.notifications, { as: 'notifications', foreignKey: 'noteId' });
      }
   }
   notes.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         content: DataTypes.TEXT,
         pinned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,

         // Virtual Fields
         createdAtPretty: {
            type: DataTypes.VIRTUAL,
            get() {
               return `${formatPostgresTimestamp(this.createdAt)}`;
            },
            set() {
               throw new LumError(400, 'Do not try to set the `createdAtPretty` value!');
            },
         },
         updatedAtPretty: {
            type: DataTypes.VIRTUAL,
            get() {
               return `${formatPostgresTimestamp(this.updatedAt)}`;
            },
            set() {
               throw new LumError(400, 'Do not try to set the `updatedAtPretty` value!');
            },
         },
      },
      {
         sequelize,
         modelName: 'notes',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   notes.beforeDestroy(async (note, options) => {
      // soft delete any children pages
      await sequelize.models.notifications.destroy({ where: { noteId: note.id }, individualHooks: true });
   });

   return notes;
};
