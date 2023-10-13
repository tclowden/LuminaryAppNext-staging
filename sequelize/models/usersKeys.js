'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class usersKeys extends Model {
      static associate(models) {
         this.belongsTo(models.keyTypesLookup, { foreignKey: 'keyTypeId', as: 'keyType' });
         this.belongsTo(models.users, { foreignKey: 'userId' });
      }
   }
   usersKeys.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         value: DataTypes.STRING,
         expiration: DataTypes.DATE,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'usersKeys',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return usersKeys;
};
