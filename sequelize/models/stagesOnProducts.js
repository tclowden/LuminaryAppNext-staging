'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class stagesOnProducts extends Model {
      static associate(models) {
         this.belongsTo(models.users, { as: 'createdBy', foreignKey: 'createdById' });
         this.belongsToMany(models.roles, {
            through: models.stageOnProductRoleConstraints,
            foreignKey: 'stageOnProductConstraintId',
         });
         this.belongsTo(models.productStages, { foreignKey: 'productStageId' });
         this.hasMany(models.fieldsOnProducts, {
            foreignKey: 'stageOnProductConstraintId',
            as: 'requiredFieldsOnProduct',
         });
         this.hasMany(models.tasksOnProducts, {
            foreignKey: 'stageOnProductConstraintId',
            as: 'requiredTasksOnProduct',
         });
         this.hasMany(models.stageOnProductRoleConstraints, {
            foreignKey: 'stageOnProductConstraintId',
            as: 'excludedRoles',
         });
      }
   }
   stagesOnProducts.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         required: DataTypes.BOOLEAN,
         displayOrder: DataTypes.INTEGER,
         timeline: DataTypes.INTEGER,
         // beginning: DataTypes.INTEGER,
         scheduled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         daysToComplete: DataTypes.INTEGER,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'stagesOnProducts',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   stagesOnProducts.beforeDestroy(async (stageOnProduct, options) => {
      await sequelize.models.stageOnProductRoleConstraints.destroy({
         where: { stageOnProductConstraintId: stageOnProduct.id },
         individualHooks: true,
      });
      await sequelize.models.stagesOnOrders.destroy({
         where: { stageOnProductId: stageOnProduct?.id },
         individualHooks: true,
      });
   });

   return stagesOnProducts;
};
