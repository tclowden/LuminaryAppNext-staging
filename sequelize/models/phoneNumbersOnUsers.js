'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class phoneNumbersOnUsers extends Model {
      static associate(models) {
         this.belongsTo(models.phoneNumbers, { foreignKey: 'phoneNumberId' });
         this.belongsTo(models.users, { foreignKey: 'userId' });
      }
   }
   phoneNumbersOnUsers.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'phoneNumbersOnUsers',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );
   return phoneNumbersOnUsers;
};
