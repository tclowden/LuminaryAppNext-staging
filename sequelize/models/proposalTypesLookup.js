'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class proposalTypesLookup extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
         // define association here
      }
   }
   proposalTypesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'proposalTypesLookup',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );

   // still need to handle whenever the state is archived, need to archive everything associated with the state
   // proposalTypesLookup.beforeUpdate(async (proposalType, options) => {
   //    if (proposalType.archived) {
   //       // Set proposalTypeId to null, if the proposalType is ever archived
   //       //     await sequelize.models.utilityCompaniesLookup
   //       //         .unscoped()
   //       //         .update({ proposalTypeId: null }, { where: { proposalTypeId: proposalType.id }, individualHooks: true })
   //       //         .catch((err) => {
   //       //            throw new LumError(400, err);
   //       //         });
   //    }
   // });

   return proposalTypesLookup;
};
