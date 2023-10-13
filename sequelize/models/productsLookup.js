'use strict';
const { Model, Sequelize } = require('sequelize');
// const LumError = require('../../models/Error');

module.exports = (sequelize, DataTypes) => {
   class productsLookup extends Model {
      static associate(models) {
         // define association here
         this.belongsToMany(models.productFields, {
            through: models.fieldsOnProducts,
            foreignKey: 'productId',
         });
         this.belongsToMany(models.productTasks, {
            through: models.tasksOnProducts,
            foreignKey: 'productId',
         });
         this.belongsToMany(models.productStages, {
            through: models.stagesOnProducts,
            foreignKey: 'productId',
         });
         this.belongsToMany(models.productCoordinators, {
            through: models.coordinatorsOnProducts,
            foreignKey: 'productId',
         });

         this.hasMany(models.fieldsOnProducts, { foreignKey: 'productId', as: 'fieldsOnProduct' });
         this.hasMany(models.tasksOnProducts, { foreignKey: 'productId', as: 'tasksOnProduct' });
         this.hasMany(models.coordinatorsOnProducts, { foreignKey: 'productId', as: 'coordinatorsOnProduct' });
         this.hasMany(models.stagesOnProducts, { foreignKey: 'productId', as: 'stagesOnProduct' });

         this.belongsToMany(models.teams, { through: models.teamsProducts, foreignKey: 'productId' });
         this.hasMany(models.teamsProducts, { foreignKey: 'productId', as: 'teamProducts' });
      }
   }
   productsLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         description: DataTypes.STRING,
         iconName: DataTypes.STRING,
         iconColor: DataTypes.STRING,
         primary: DataTypes.BOOLEAN,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'productsLookup',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   // the beforeUpdate hook is called before a stageOnProduct is updated.
   // If the delete property is set to true,
   // the hook queries the Comment model and updates the archived property to true for all comments that belong to the updated post.
   // productsLookup.beforeUpdate(async (product, options) => {
   //    if (product.deletedAt) {
   //       // archive the everythign associate to the product... this will act as a cascade hook... but just archiving
   //       await sequelize.models.fieldsOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productId: product.id }, individualHooks: true, paranoid: false }
   //          );
   //       await sequelize.models.tasksOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productId: product.id }, individualHooks: true, paranoid: false }
   //          );
   //       await sequelize.models.stagesOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productId: product.id }, individualHooks: true, paranoid: false }
   //          );
   //       await sequelize.models.coordinatorsOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productId: product.id }, individualHooks: true, paranoid: false }
   //          );
   //    }
   // });

   productsLookup.beforeDestroy(async (product, options) => {
      await sequelize.models.fieldsOnProducts.destroy({ where: { productId: product.id }, individualHooks: true });
      await sequelize.models.tasksOnProducts.destroy({ where: { productId: product.id }, individualHooks: true });
      await sequelize.models.stagesOnProducts.destroy({ where: { productId: product.id }, individualHooks: true });
      await sequelize.models.coordinatorsOnProducts.destroy({
         where: { productId: product.id },
         individualHooks: true,
      });
   });

   return productsLookup;
};
