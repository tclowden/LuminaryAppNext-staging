'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class productFieldOptions extends Model {
      static associate(models) {
         this.belongsTo(models.productFields, { as: 'productField', foreignKey: 'productFieldId' });
      }
   }
   productFieldOptions.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         value: DataTypes.STRING,
         displayOrder: DataTypes.INTEGER,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'productFieldOptions',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );

   // NOTE:
   // MAYBE, if we decide to use productFieldOptionId as a foreign key when creating an order with the answer...
   // if we archive a product field option, we will have to archive that answer row as well

   return productFieldOptions;
};
