'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class tasksOnProducts extends Model {
      static associate(models) {
         this.belongsTo(models.stagesOnProducts, {
            as: 'stageOnProductConstraint',
            foreignKey: 'stageOnProductConstraintId',
         });
         // this.belongsToMany(models.fieldsOnProducts, {
         //    through: models.tasksTimeToComplete,
         //    foreignKey: 'taskOnProductId',
         // });
         this.belongsTo(models.productTasks, { foreignKey: 'productTaskId', as: 'productTask' });
         this.belongsTo(models.taskDueDateTypesLookup, {
            foreignKey: 'taskDueDateTypesLookupId',
            as: 'taskDueDateType',
         });
      }
   }
   tasksOnProducts.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         displayOrder: DataTypes.INTEGER,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'tasksOnProducts',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );

   tasksOnProducts.beforeDestroy(async (taskOnProduct, options) => {
      await sequelize.models.tasksOnOrders.destroy({
         where: { taskOnProductId: taskOnProduct.id },
         individualHooks: true,
      });
   });

   return tasksOnProducts;
};
