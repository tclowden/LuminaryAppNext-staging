'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class rolesOnProductCoordinators extends Model {
      static associate(models) {
         this.belongsTo(models.productCoordinators, { foreignKey: 'productCoordinatorId' });
         this.belongsTo(models.roles, { foreignKey: 'roleId', as: 'role' });
      }
   }
   rolesOnProductCoordinators.init(
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
         modelName: 'rolesOnProductCoordinators',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );
   return rolesOnProductCoordinators;
};
