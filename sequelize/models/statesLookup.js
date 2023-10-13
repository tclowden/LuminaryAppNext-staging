'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class statesLookup extends Model {
      static associate(models) {}
   }
   statesLookup.init(
      {
         id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.literal('uuid_generate_v4()'),
         },
         name: DataTypes.STRING,
         abbreviation: DataTypes.STRING,
         // whether the organization does business in the state
         supported: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
         },
         oldId: DataTypes.INTEGER,
      },
      {
         sequelize,
         modelName: 'statesLookup',
         freezeTableName: true,
         timestamps: true,
         paranoid: true,
      }
   );

   // still need to handle whenever the state is archived, need to archive everything associated with the state
   // statesLookup.beforeUpdate(async (state, options) => {
   //    if (state.deletedAt) {
   //       // should the utility company be archived or just left without a state?
   //       // for now, set the stateId to null when the state is archived
   //       await sequelize.models.utilityCompaniesLookup
   //          .unscoped()
   //          .update({ stateId: null }, { where: { stateId: state.id }, individualHooks: true, paranoid: false })
   //          .catch((err) => {
   //             throw new LumError(400, err);
   //          });
   //    }
   // });

   statesLookup.beforeDestroy(async (state, options) => {
      await sequelize.models.utilityCompaniesLookup.destroy({ where: { stateId: state.id }, individualHooks: true });
   });

   return statesLookup;
};
