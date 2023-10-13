'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class phoneNumbersOnCallRoutes extends Model {
      static associate(models) {
         this.belongsTo(models.phoneNumbers, { foreignKey: 'phoneNumberId' });
         this.belongsTo(models.callRoutes, { foreignKey: 'callRouteId' });
      }
   }
   phoneNumbersOnCallRoutes.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
      },
      {
         sequelize,
         modelName: 'phoneNumbersOnCallRoutes',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return phoneNumbersOnCallRoutes;
};
