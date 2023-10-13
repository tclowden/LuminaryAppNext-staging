'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
   class leadFieldOptions extends Model {
      static associate(models) {
         this.belongsTo(models.leadFields, { as: 'leadField', foreignKey: 'leadFieldId' });
      }
   }
   leadFieldOptions.init(
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
         modelName: 'leadFieldOptions',
         paranoid: true,
         timestamps: true,
         freezeTableName: true,
      }
   );
   return leadFieldOptions;
};
