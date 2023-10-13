'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class productCoordinators extends Model {
      static associate(models) {
         this.belongsToMany(models.productsLookup, {
            through: models.coordinatorsOnProducts,
            foreignKey: 'productCoordinatorId',
            as: 'productsLookup',
         });
         this.belongsToMany(models.roles, {
            through: models.rolesOnProductCoordinators,
            foreignKey: 'productCoordinatorId',
            as: 'roles',
         });
         this.hasMany(models.rolesOnProductCoordinators, { as: 'rolesOnProductCoordinator' });
      }
   }
   productCoordinators.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         otherOldIds: DataTypes.ARRAY(DataTypes.INTEGER),
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'productCoordinators',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   // productCoordinators.beforeUpdate(async (productCoordinator, options) => {
   //    if (productCoordinator.deletedAt) {
   //       // archive everything associated to the productCoordinatorId
   //       // archive the fieldsOnProducts using the productCoordinatorId
   //       await sequelize.models.coordinatorsOnProducts
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productCoordinatorId: productCoordinator.id }, individualHooks: true, paranoid: false }
   //          );

   //       // archive the associated rolesOnProductCoordinators using the productCoordinator id
   //       await sequelize.models.rolesOnProductCoordinators
   //          .unscoped()
   //          .update(
   //             { deletedAt: new Date() },
   //             { where: { productCoordinatorId: productCoordinator.id }, individualHooks: true, paranoid: false }
   //          );
   //    }
   // });

   productCoordinators.beforeDestroy(async (productCoordinator, options) => {
      // archive the fieldsOnProducts using the productCoordinatorId
      await sequelize.models.coordinatorsOnProducts.destroy({
         where: { productCoordinatorId: productCoordinator.id },
         individualHooks: true,
      });

      // archive the associated rolesOnProductCoordinators using the productCoordinator id
      await sequelize.models.rolesOnProductCoordinators.destroy({
         where: { productCoordinatorId: productCoordinator.id },
         individualHooks: true,
      });
   });

   return productCoordinators;
};
