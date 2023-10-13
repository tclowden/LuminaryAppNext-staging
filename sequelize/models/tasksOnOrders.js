'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class tasksOnOrders extends Model {
      static associate(models) {
         this.belongsTo(models.tasksOnProducts, { foreignKey: 'taskOnProductId', as: 'taskOnProduct' });
         this.belongsTo(models.productTasks, { foreignKey: 'productTaskId', as: 'productTask' });
         this.belongsTo(models.users, { foreignKey: 'assignedToId', as: 'assignedTo' });
         this.belongsTo(models.orders, { foreignKey: 'orderId', as: 'order' });
         // one off task columns
         this.belongsTo(models.users, { foreignKey: 'createdById', as: 'createdBy' });
         this.belongsTo(models.users, { foreignKey: 'updatedById', as: 'updatedBy' });
         this.belongsTo(models.users, { foreignKey: 'completedById', as: 'completedBy' });
      }
   }
   tasksOnOrders.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
         },
         completedAt: DataTypes.DATE,
         dueAt: DataTypes.DATE,
         oldId: DataTypes.INTEGER,
         // one off task columns
         name: DataTypes.STRING,
         description: DataTypes.TEXT,
      },
      {
         sequelize,
         modelName: 'tasksOnOrders',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );
   return tasksOnOrders;
};
