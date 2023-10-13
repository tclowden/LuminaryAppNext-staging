'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class productTasks extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
         this.belongsToMany(models.productsLookup, { through: models.tasksOnProducts, foreignKey: 'productTaskId' });
      }
   }
   productTasks.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         description: DataTypes.TEXT,
         otherOldIds: DataTypes.ARRAY(DataTypes.INTEGER),
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'productTasks',
         paranoid: true,
         freezeTableName: true,
         timestamps: true,
      }
   );

   // productTasks.beforeUpdate(async (productTask, options) => {
   //    if (productTask.deletedAt) {
   //       // archive everything associated to the productTaskId
   //       // archive the fieldsOnProducts using the productTaskId
   //       await sequelize.models.tasksOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productTaskId: productTask.id }, individualHooks: true, paranoid: false }
   //          )
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //    }
   // });

   productTasks.beforeDestroy(async (productTask, options) => {
      await sequelize.models.tasksOnProducts.destroy({
         where: { productTaskId: productTask.id },
         individualHooks: true,
      });
   });

   return productTasks;
};
