'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class fieldsOnOrders extends Model {
      static associate(models) {
         this.belongsTo(models.fieldsOnProducts, { foreignKey: 'fieldOnProductId', as: 'fieldOnProduct' });
         // goal is to delete the productFields col off of this table
         // this.belongsTo(models.productFields, { foreignKey: 'productFieldId', as: 'productField' });
         this.belongsTo(models.orders, { foreignKey: 'orderId' });
      }
   }
   fieldsOnOrders.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         answer: DataTypes.TEXT,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'fieldsOnOrders',
         timestamps: true,
         paranoid: true,
         freezeTableName: true,
      }
   );

   fieldsOnOrders.beforeCreate(async (fieldOnOrder, options) => {
      await handleUpdateOrder(sequelize, fieldOnOrder);
   });

   fieldsOnOrders.beforeUpdate(async (fieldOnOrder, options) => {
      await handleUpdateOrder(sequelize, fieldOnOrder);
   });

   return fieldsOnOrders;
};

const handleUpdateOrder = async (sequelize, fieldOnOrder) => {
   if (!fieldOnOrder?.fieldOnProductId) return;
   const fieldOnProductRes = await sequelize.models.fieldsOnProducts
      .findByPk(fieldOnOrder.fieldOnProductId, {
         include: [{ model: sequelize.models.productFields, as: 'productField', required: false }],
      })
      .then((res) => JSON.parse(JSON.stringify(res)))
      .catch((err) => {
         console.log('err fetching field on product in fields on order before create hook:', err);
      });

   // check if the field name is installSignedDate, if it is, write to the orders.installSignedDate column
   if (fieldOnProductRes?.productField?.label === 'Install Signed Date') {
      await sequelize.models.orders
         .update({ installSignedDate: fieldOnOrder?.answer }, { where: { id: fieldOnOrder?.orderId } })
         .catch((err) => {
            console.log('err updating order in fields on order before create hook', err);
         });
   }
};
