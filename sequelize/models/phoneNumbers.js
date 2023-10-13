'use strict';
const { Model, Sequelize } = require('sequelize');
const { getFormattedPhoneNumber } = require('../../utilities/helpers');

module.exports = (sequelize, DataTypes) => {
   class phoneNumbers extends Model {
      static associate(models) {
         this.belongsTo(models.phoneNumberTypesLookup, { as: 'type', foreignKey: 'typeId' });

         this.belongsToMany(models.users, {
            through: models.phoneNumbersOnUsers,
            foreignKey: 'phoneNumberId',
            as: 'users',
         });
         this.hasMany(models.phoneNumbersOnUsers, { as: 'usersOnPhoneNumber', foreignKey: 'phoneNumberId' });

         this.belongsToMany(models.leadSources, {
            through: models.phoneNumbersOnLeadSources,
            foreignKey: 'phoneNumberId',
            as: 'leadSources',
         });
         this.hasMany(models.phoneNumbersOnLeadSources, {
            as: 'leadSourcesOnPhoneNumber',
            foreignKey: 'phoneNumberId',
         });

         this.belongsToMany(models.callRoutes, {
            through: models.phoneNumbersOnCallRoutes,
            foreignKey: 'phoneNumberId',
            as: 'callRoutes',
         });
         this.hasMany(models.phoneNumbersOnCallRoutes, {
            as: 'callRoutesOnPhoneNumber',
            foreignKey: 'phoneNumberId',
         });

         this.hasMany(models.reputationOnPhoneNumbers, { as: 'reputation', foreignKey: 'phoneNumberId' });
      }
   }
   phoneNumbers.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         number: {
            type: DataTypes.STRING(12),
            isUnique: true,
            validate: {
               len: [12, 12],
            },
            allowNull: false,
         },
         numberSID: {
            type: DataTypes.STRING,
         },
         active: DataTypes.BOOLEAN,
         oldId: DataTypes.INTEGER,

         // Virtual Fields
         prettyNumber: {
            type: DataTypes.VIRTUAL,
            get() {
               if (!this.number) return null;
               return getFormattedPhoneNumber(this.number);
            },
            set() {
               throw new LumError(400, 'Do not try to set the `prettyNumber` value!');
            },
         },
      },
      {
         sequelize,
         modelName: 'phoneNumbers',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   phoneNumbers.beforeDestroy(async (phoneNumber, options) => {
      await sequelize.models.phoneNumbersOnLeadSources.destroy({
         where: { phoneNumberId: phoneNumber.id },
      });

      await sequelize.models.phoneNumbersOnUsers.destroy({ where: { phoneNumberId: phoneNumber.id } });
   });

   return phoneNumbers;
};
