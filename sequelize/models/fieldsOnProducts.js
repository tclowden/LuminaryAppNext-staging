'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class fieldsOnProducts extends Model {
      static associate(models) {
         // this.belongsToMany(models.orders, {
         //    through: models.fieldsOnOrders,
         //    foreignKey: 'fieldOnProductId',
         //    // as: 'fieldsOnOrder',
         // });
         this.belongsTo(models.productFields, { foreignKey: 'productFieldId' });
         this.belongsTo(models.productsLookup, { foreignKey: 'productId' });
         // this.belongsToMany(models.tasksOnProducts, {
         //    through: models.tasksTimeToComplete,
         //    foreignKey: 'fieldOnProductId',
         // });
         this.belongsTo(models.stagesOnProducts, {
            as: 'stageOnProductConstraint',
            foreignKey: 'stageOnProductConstraintId',
         });
      }
   }
   fieldsOnProducts.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         displayOrder: DataTypes.INTEGER,
         required: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         hidden: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         hideOnCreate: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'fieldsOnProducts',
         freezeTableName: true,
         paranoid: true,
         timestamps: true,
      }
   );

   fieldsOnProducts.beforeDestroy(async (fieldOnProduct, options) => {
      await sequelize.models.fieldsOnOrders.destroy({
         where: { fieldOnProductId: fieldOnProduct?.id },
         individualHooks: true,
      });
   });
   return fieldsOnProducts;
};
