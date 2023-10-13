'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
   class teams extends Model {
      static associate(models) {
         // define association here
         this.belongsToMany(models.users, { through: models.teamsUsers, foreignKey: 'teamId', as: 'users' });
         this.hasMany(models.teamsUsers, { foreignKey: 'teamId', as: 'teamUsers' });
         this.belongsToMany(models.productsLookup, { through: models.teamsProducts, foreignKey: 'teamId' });
         this.hasMany(models.teamsProducts, { foreignKey: 'teamId', as: 'teamProducts' });
         this.belongsTo(models.teamTypesLookup, { foreignKey: 'teamTypeId', as: 'teamType' });
      }
   }
   teams.init(
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
         modelName: 'teams',
         timestamps: true,
         freezeTableName: true,
         paranoid: true,
      }
   );

   teams.beforeDestroy(async (team, options) => {
      await sequelize.models.teamsUsers.destroy({ where: { teamId: team.id }, individualHooks: true });
      await sequelize.models.teamsProducts.destroy({ where: { teamId: team.id }, individualHooks: true });
   });

   return teams;
};
