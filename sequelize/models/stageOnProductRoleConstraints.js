'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class stageOnProductRoleConstraints extends Model {
      static associate(models) {
         this.belongsTo(models.roles, { foreignKey: 'roleId', as: 'role' });
         this.belongsTo(models.stagesOnProducts, { foreignKey: 'stageOnProductConstraintId' });
      }
   }
   stageOnProductRoleConstraints.init(
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
         modelName: 'stageOnProductRoleConstraints',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return stageOnProductRoleConstraints;
};
