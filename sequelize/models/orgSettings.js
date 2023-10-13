'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class orgSettings extends Model {
      static associate(models) {}
   }

   orgSettings.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         yearToDateRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         sixWeekRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         monthlyRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         dailyRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         weeklyRevenue: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         dailyTalkTime: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         appointmentsSet: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         contractsSigned: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         leadsAllowedInPipe: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
         dailyBucketGrabsLimit: {
            type: Sequelize.INTEGER,
            allowNull: true,
         },
      },
      {
         sequelize,
         modelName: 'orgSettings',
         timestamps: true,
         freezeTableName: true,
      }
   );

   return orgSettings;
};
